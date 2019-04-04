import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AdminComponent } from './admin.component';
import { PostComponent } from './post/post.component';
import { PostEditComponent } from './post/post-edit.component';
import { ProfileComponent } from './setting/profile.component';
import { UpdatePasswordComponent } from './setting/update-password.component';
import { EditorMDComponent } from './../components/editor/editor-md.component';


@NgModule({
  declarations: [
    AdminComponent,
    PostComponent,
    ProfileComponent,
    PostEditComponent,
    UpdatePasswordComponent,
    EditorMDComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: 'post',
            component: PostComponent
          },
          {
            path: 'post/edit',
            component: PostEditComponent
          },
          {
            path: 'post/new',
            component: PostEditComponent
          },
          {
            path: 'profile',
            component: ProfileComponent
          },
          {
            path: 'update-password',
            component: UpdatePasswordComponent
          },
          {
            path: '**',
            component: PostComponent
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
export class AdminModule {}
