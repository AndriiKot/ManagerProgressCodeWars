const element = document.querySelector('.box-animation')


const deg = 30;                       // угол наклона

const color_start = '#00cc99';        // цвет линии
const color_end  = 'transparent';     // прозрачные цвет
let procent_width_line = 0;           // точка отчета форморование градиента
const max_procent_width_line = 100;   // максимальное допустимое значение  конечная точка
const step_procent_width_line = 30;   // ширина видемой и прозрачной линии

let str = '';                         
let i = 0

for (;procent_width_line <= max_procent_width_line;i++){
 const a = `${color_start} ${procent_width_line}%`
 const b = `${color_end} ${procent_width_line}%`
 const compon_str = (i % 2 == 0) ? a +','+ b : b + ',' + a;
  
  str += compon_str +','
  procent_width_line += step_procent_width_line;
}

function A(color = '#00cc99') {
  return color
}
console.log(typeof A());

let final_str = `linear-gradient(${deg}deg,${str})` //


element.style.background = final_str

    let nIntervId;

    function animation_rotate_interval() {
      nIntervId = requestAnimationFrame(calc_animation_rotate);
    }


    function calc_animation_rotate(){
      final_str = `linear-gradient(${deg}deg,${str}`
      final_str = final_str.slice(0,final_str.length-1)+')'
      element.style.background = final_str
  }


  

 