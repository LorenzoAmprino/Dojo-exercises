package it.peoplefirst.dojo.Exercises.biblioteca.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Autore {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(columnDefinition = "TEXT")
    private String biografia;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Autore autore)) return false;
        return id != null && id.equals(autore.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
