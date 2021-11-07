let tag = document.getElementById('tag');
let faq = document.getElementById('faq');
let close = document.getElementById('close');
tag.addEventListener('click', ()=>{
    faq.style.transform = 'scale(1)';
})
close.addEventListener('click', ()=>{
    faq.style.transform = 'scale(0)';
})