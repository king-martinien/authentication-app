import { FormControl } from '@angular/forms';

export interface AuthForm {
  fullname?: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}
