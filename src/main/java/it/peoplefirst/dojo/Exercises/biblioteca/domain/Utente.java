package it.peoplefirst.dojo.Exercises.biblioteca.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class Utente {
    @Id
    private String id;
    private String nome;
    private String numeroTessera;
    @ManyToMany
    private List<Libro> libriPreferiti;
}
