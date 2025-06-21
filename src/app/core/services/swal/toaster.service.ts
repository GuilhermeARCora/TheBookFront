import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

    Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

  success(message: string): void {
    this.Toast.fire({
      icon: 'success',
      title: message
    });
  }

  error(message: string): void  {
    this.Toast.fire({
      icon: 'error',
      title: message
    });
  }

  info(message: string): void  {
    this.Toast.fire({
      icon: 'info',
      title: message
    });
  }

  warning(message: string): void  {
    this.Toast.fire({
      icon: 'warning',
      title: message
    });
  }

}
