package com.habit.repository;

import com.habit.entity.HabitException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitExceptionRepository extends JpaRepository<HabitException, Long> {
    List<HabitException> findByHabitId(Long habitId);
    Optional<HabitException> findByHabitIdAndExceptionDate(Long habitId, LocalDate exceptionDate);
}
