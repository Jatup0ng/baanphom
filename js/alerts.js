/**
 * Custom SweetAlert2 Configuration for BAAN PHOM
 */
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const bpAlert = {
    success: (title, text) => {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonColor: '#8B5E3C',
            fontFamily: 'Sarabun'
        });
    },
    error: (title, text) => {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonColor: '#8B5E3C',
            fontFamily: 'Sarabun'
        });
    },
    confirm: (title, text) => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8B5E3C',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            fontFamily: 'Sarabun'
        });
    },
    prompt: (title, defaultValue, placeholder) => {
        return Swal.fire({
            title: title,
            input: 'text',
            inputValue: defaultValue || '',
            inputPlaceholder: placeholder || '',
            showCancelButton: true,
            confirmButtonColor: '#8B5E3C',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            fontFamily: 'Sarabun'
        });
    }
};
