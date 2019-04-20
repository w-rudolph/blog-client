import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FrontComponent } from './front.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PostComponent } from './post/post.component';
import { PostDetailComponent } from './post/post-detail.component';
import { SanitizeHtmlPipe } from '../pipes/santitizeHtml.pipe';
import { TimeagoPipe } from './../pipes/timeago.pipe';
import { PostCommentComponent } from './post/post-comment.component';
import { CommentComponent } from '../components/comment/comment.component';

@NgModule({
  declarations: [
    FrontComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    PostComponent,
    PostDetailComponent,
    SanitizeHtmlPipe,
    TimeagoPipe,
    PostCommentComponent,
    CommentComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FrontComponent,
        children: [
          {
            path: '',
            component: PostComponent
          },
          {
            path: 'category/:id',
            component: PostComponent
          },
          {
            path: 'post/:id',
            component: PostDetailComponent
          },
          {
            path: 'login',
            component: LoginComponent,
            data: { isSingle: true }
          },
          {
            path: 'register',
            component: RegisterComponent,
            data: { isSingle: true }
          },
          {
            path: 'reset-password',
            component: ResetPasswordComponent,
            data: { isSingle: true }
          }
        ]
      }
    ]),
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class FrontModule {}
