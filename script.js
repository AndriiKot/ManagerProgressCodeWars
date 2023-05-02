const element = document.querySelector('.box-animation')


const deg = 30;                       // угол наклона
const color_start = '#00cc99';        // цвет линии
const color_end  = 'transparent';     // прозрачные цвет
let procent_width_line = 0;           // точка отчета форморование градиента
const max_procent_width_line = 100;   // максимальное допустимое значение  конечная точка
const step_procent_width_line = 30;   // ширина видемой и прозрачной линии

let str = '';                         
let i = 0;

function createStrAnimationline(
  color1 = color_start,
  color2 = color_end,
  proc = procent_width_line,
  step_width = step_procent_width_line){
    for (;procent_width_line <= max_procent_width_line;i++){
     const a = `${color1} ${procent_width_line}%`
     const b = `${color2} ${procent_width_line}%`
     const compon_str = (i % 2 == 0) ? a +','+ b : b + ',' + a;
     str += compon_str +','
     procent_width_line += step_procent_width_line;
    };
return str
};

createStrAnimationline();
let final_str = `linear-gradient(${deg}deg,${str})` 

    let nIntervId;

    function animation_rotate_interval() {
      nIntervId = requestAnimationFrame(calc_animation_rotate);
    }

    function calc_animation_rotate(){
      final_str = `linear-gradient(${deg}deg,${str}`
      final_str = final_str.slice(0,final_str.length-1)+')'
      element.style.background = final_str
    }


    
  // demo barSelectorColors 
  const colors = document.querySelectorAll('.color')

  function f(event) {
    console.dir(typeof(event.currentTarget.classList[1]));
    let color_ = event.currentTarget.classList[1];
    createStrAnimationline(color);
  }

  colors.forEach(color => {
    color.addEventListener('click',f)
  })
  // demo barSelectorColors

  


  

 