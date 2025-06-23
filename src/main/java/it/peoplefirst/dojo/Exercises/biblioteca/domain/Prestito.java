package it.peoplefirst.dojo.Exercises.biblioteca.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class Prestito {
    @Id
    private String id;
    private Libro libro;
    private Utente utente;
    private LocalDate dataInizio;
    private LocalDate dataScadenza;
}
