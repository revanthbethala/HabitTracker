package com.habit.service.impl;

import com.habit.dto.request.CheckInRequest;
import com.habit.dto.response.HabitResponse;
import com.habit.entity.CheckIn;
import com.habit.entity.Habit;
import com.habit.entity.User;
import com.habit.exception.ResourceNotFoundException;
import com.habit.exception.UnauthorizedException;
import com.habit.repository.CheckInRepository;
import com.habit.repository.HabitRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.BadgeService;
import com.habit.service.CheckInService;
import com.habit.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CheckInServiceImpl implements CheckInService {

    private final CheckInRepository checkInRepository;
    private final HabitRepository habitRepository;
    private final HabitService habitService;
    private final BadgeService badgeService;

    @Override
    @Transactional
    public HabitResponse upsertCheckIn(Long habitId, CheckInRequest request) {
        Habit habit = getOwnedHabit(habitId);
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();

        if (date.isBefore(LocalDate.now().minusDays(7)) || date.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date must be within the last 7 days.");
        }

        Optional<CheckIn> existing = checkInRepository.findByHabitIdAndCheckInDate(habitId, date);
        CheckIn checkIn;
        if (existing.isPresent()) {
            checkIn = existing.get();
            checkIn.setStatus(request.getStatus());
            checkIn.setValue(request.getValue());
            checkIn.setNote(request.getNote());
        } else {
            checkIn = CheckIn.builder()
                    .habit(habit)
                    .checkInDate(date)
                    .status(request.getStatus())
                    .value(request.getValue())
                    .note(request.getNote())
                    .build();
        }

        checkInRepository.save(checkIn);
        
        // Trigger badge checks
        badgeService.checkAndAwardBadges(habit.getUser());
        
        return habitService.getHabitById(habitId);
    }

    @Override
    public Page<?> getCheckInsByHabit(Long habitId, Pageable pageable) {
        getOwnedHabit(habitId); // Access check
        return checkInRepository.findByHabitId(habitId, pageable);
    }

    @Override
    @Transactional
    public void deleteCheckIn(Long checkInId) {
        CheckIn checkIn = checkInRepository.findById(checkInId)
                .orElseThrow(() -> new ResourceNotFoundException("Check-in not found with id: " + checkInId));
        
        if (!checkIn.getHabit().getUser().getId().equals(SecurityUtils.getCurrentUser().getId())) {
            throw new UnauthorizedException("You do not have permission to access this check-in");
        }
        
        checkInRepository.delete(checkIn);
    }

    private Habit getOwnedHabit(Long id) {
        User currentUser = SecurityUtils.getCurrentUser();
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id: " + id));
        
        if (!habit.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not have permission to access this habit");
        }
        return habit;
    }
}
