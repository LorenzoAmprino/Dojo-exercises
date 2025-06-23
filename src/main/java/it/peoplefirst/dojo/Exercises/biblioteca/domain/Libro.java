package it.peoplefirst.dojo.Exercises.biblioteca.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Libro {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String titolo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autore_id", nullable = false)
    private Autore autore;
    
    @Column(unique = true, nullable = false)
    private String isbn;
    
    private String genere;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Libro libro)) return false;
        return id != null && id.equals(libro.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
