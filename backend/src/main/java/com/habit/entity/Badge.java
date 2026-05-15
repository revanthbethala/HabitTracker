package com.habit.entity;

import com.habit.enums.BadgeCriteriaType;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeCriteriaType criteriaType;

    @Column(nullable = false)
    private Integer criteriaValue;

    @OneToMany(mappedBy = "badge", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserBadge> userBadges;
}
