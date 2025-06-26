import { TestBed } from '@angular/core/testing';
import { ToasterService } from './toaster.service';
import Swal from 'sweetalert2';

describe('ToasterService', () => {
  let service: ToasterService;
  let fireSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToasterService]
    });
    service = TestBed.inject(ToasterService);
    // espiamos o método fire do mixin de toast criado em Toast = Swal.mixin(...)
    fireSpy = spyOn(service.Toast, 'fire');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('success() should call Toast.fire with icon "success" and the message as title', () => {
    service.success('Tudo ok');
    expect(fireSpy).toHaveBeenCalledWith({
      icon: 'success',
      title: 'Tudo ok'
    });
  });

  it('error() should call Toast.fire with icon "error" and the message as title', () => {
    service.error('Falha');
    expect(fireSpy).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Falha'
    });
  });

  it('info() should call Toast.fire with icon "info" and the message as title', () => {
    service.info('Atenção');
    expect(fireSpy).toHaveBeenCalledWith({
      icon: 'info',
      title: 'Atenção'
    });
  });

  it('warning() should call Toast.fire with icon "warning" and the message as title', () => {
    service.warning('Cuidado');
    expect(fireSpy).toHaveBeenCalledWith({
      icon: 'warning',
      title: 'Cuidado'
    });
  });
});
