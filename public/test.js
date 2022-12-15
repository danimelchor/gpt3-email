const div = document.createElement('div');
div.classList.add('button-container');

const button1 = document.createElement('button');
button1.innerHTML = '👍';
button1.addEventListener('click', () => button1.classList.add('clicked'));

const button2 = document.createElement('button');
button2.innerHTML = '👎';

const divider1 = document.createElement('div');
divider1.classList.add('divider');

const button3 = document.createElement('button');
button3.innerHTML = '🙎‍♂️';

const button4 = document.createElement('button');
button4.innerHTML = '🧑‍💻';

const divider2 = document.createElement('div');
divider2.classList.add('divider');

const button5 = document.createElement('button');
button5.innerHTML = '🤩';

const button6 = document.createElement('button');
button6.innerHTML = '🙂';

const button7 = document.createElement('button');
button7.innerHTML = '🥺';

const button8 = document.createElement('button');
button8.innerHTML = '🙄';

const divider3 = document.createElement('div');
divider3.classList.add('divider');

const button9 = document.createElement('button');
button9.innerHTML = 'WRITE';
button9.style.backgroundColor = '#DC3C44';
button9.style.color = 'white';
button9.style.fontWeight = 'bold';
button9.style.fontFamily = '"Poppins", sans-serif';

div.appendChild(button1);
div.appendChild(button2);
div.appendChild(divider1);
div.appendChild(button3);
div.appendChild(button4);
div.appendChild(divider2);
div.appendChild(button5);
div.appendChild(button6);
div.appendChild(button7);
div.appendChild(button8);
div.appendChild(divider3);
div.appendChild(button9);

document.body.appendChild(div);
