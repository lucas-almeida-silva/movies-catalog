import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { MatDialog } from '@angular/material/dialog';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {
  id: number;
  registerForm: FormGroup;
  generos: Array<string>;

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private filmeService: FilmesService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if(this.id) {
      this.filmeService.visualizar(this.id).subscribe(
        (filme: Filme) => {
          this.criarFormulario(filme);
        }
      );
    } else {
      this.criarFormulario({} as Filme);
    }

    this.generos = ['Ação', 'Romance', 'Aventura', 'Terror', 'Ficção Científica', 'Comédia', 'Drama'];
  } 

  submit(): void {
    this.registerForm.markAllAsTouched();
    if(this.registerForm.invalid) {
      return;
    }
    const filme = this.registerForm.getRawValue() as Filme;
    this.id ? this.editar(Object.assign({id: this.id}, filme)) : this.salvar(filme);
  }

  reiniciarForm(): void {
    this.registerForm.reset();
  }

  private criarFormulario(filme: Filme): void {
    this.registerForm = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, Validators.minLength(10)],
      genero: [filme.genero, [Validators.required]]
    });
  }

  private salvar(filme: Filme): void {
    this.filmeService.salvar(filme).subscribe(
      () => {
        const config= { 
          data: {
            btnSucesso: 'Ir para a listagem',
            btnCancelar: 'Cadastrar um novo filme',
            corBtnCancelar: 'primary',
            possuiBtnFechar: true
          } as Alerta
        }
        const dialogRef = this.dialog.open(AlertaComponent, config);
        dialogRef.afterClosed().subscribe(
          (opcao:boolean) => {
            if(opcao) {
              this.router.navigate(['filmes']);
            } else {
              this.reiniciarForm();
            }
          }
        )
      },
      () => {
        const config= { 
          data: {
            titulo: 'Erro ao salvar o registro!',
            descricao: 'Não conseguimos salvar seu registro, favor tentar novamente mais tarde',
            btnSucesso: 'Fechar',
            corBtnSucesso: 'warn'
          } as Alerta
        };
        this.dialog.open(AlertaComponent, config);
      }
    )
  }

  private editar(filme: Filme): void {
    this.filmeService.editar(filme).subscribe(
      () => {
        const config= { 
          data: {
            descricao: 'Seu registro foi atualizado com sucesso',
            btnSucesso: 'Ir para a listagem'
          } as Alerta
        }
        const dialogRef = this.dialog.open(AlertaComponent, config);
        dialogRef.afterClosed().subscribe(
          () => {
            this.router.navigate(['filmes']);
          }
        )
      },
      () => {
        const config= { 
          data: {
            titulo: 'Erro ao editar o registro!',
            descricao: 'Não conseguimos editar seu registro, favor tentar novamente mais tarde',
            btnSucesso: 'Fechar',
            corBtnSucesso: 'warn'
          } as Alerta
        };
        this.dialog.open(AlertaComponent, config);
      }
    )
  }

}
