package it.peoplefirst.dojo.Exercises.biblioteca.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class Libro {

    @Id
    private String id;
    private String titolo;
    private Autore autore;
    private String isbn;
    private String genere;
}
