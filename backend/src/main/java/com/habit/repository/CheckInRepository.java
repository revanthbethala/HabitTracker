package com.habit.repository;

import com.habit.entity.CheckIn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByHabitId(Long habitId);
    Page<CheckIn> findByHabitId(Long habitId, Pageable pageable);
    Optional<CheckIn> findByHabitIdAndCheckInDate(Long habitId, LocalDate checkInDate);
    List<CheckIn> findByHabitIdAndCheckInDateBetween(Long habitId, LocalDate start, LocalDate end);
}
