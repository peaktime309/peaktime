package com.dinnertime.peaktime.domain.hiking.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "calendars")
@Getter
public class Calendar {
    @Id
    private LocalDate date;
}
