function runAnimation(){
  if (onMobile) return;

  var textWrapper = document.querySelector('.subtitle .letters');
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

  anime.timeline({loop: true})
  .add({
    targets: '.subtitle .letter',
    translateY: [0, -6, 0],
    scale: [1, 1.1, 1],
    duration: 700,
    easing: 'easeInOutSine',
    delay: (el, i) => 55 * (i+1)
  }).add({
    duration: 2000,
  })
}

runAnimation();
