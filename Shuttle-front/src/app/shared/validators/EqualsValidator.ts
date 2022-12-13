import { FormGroup } from "@angular/forms";

export function EqualsValidator(control1name: string, control2name: string) {
    return (formGroup: FormGroup) => {
        const control1 = formGroup.controls[control1name];
        const control2 = formGroup.controls[control2name];

        if (control1.errors && !control2.errors?.["equalsValidator"]) {
            return;
        }

        if (control1.value !== control2.value) {
            control2.setErrors({ equalsValidator: true });
        } else {
            control2.setErrors(null);
        }
    }
}
