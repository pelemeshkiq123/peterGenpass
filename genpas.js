var genpas_spec_symbols = '"#$%&()*+,-./:;<=>?@[\\]^_`{|}~';

function htmlspecialchars(text) {
	var chars = ['&', '<', '>', '"', "'"];
	var replacements = ['&amp;', '&lt;', '&gt;', '&quot;', '&apos;'];
	for (var i = 0; i < chars.length; i++) {
		var re = new RegExp(chars[i], 'gi');
		text = text.replace(re, replacements[i]);
	}
	return text;
}

function gen_pw() {
	var genbutton = document.getElementById('genbutton');
	genbutton.disabled = true;

	var pass_cmnt = document.getElementById('pass_cmnt');
	pass_cmnt.innerHTML = '';

	var pass = document.getElementById('pass');
	pass.style.display = 'none';
	pass.innerHTML = '';

	gen_pw2();
}

function gen_rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gen_pakhomov_mode() {
	var genbutton = document.getElementById('genbutton');
	var pakhomovButton = document.getElementById('pakhomovButton');

	// Блокируем обе кнопки на время генерации
	genbutton.disabled = true;
	pakhomovButton.disabled = true;

	var pass_cmnt = document.getElementById('pass_cmnt');
	pass_cmnt.innerHTML = '';

	var pass = document.getElementById('pass');
	pass.style.display = 'none';
	pass.innerHTML = '';

	// Параметры режима Пахомова: 5 паролей по 20 символов
	var pwlen = 20;
	var pwnum = 5;

	// Собираем все символы для полного рандома
	var symbols = '';
	symbols += 'abcdefghijklmnopqrstuvwxyz';
	symbols += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	symbols += '1234567890';
	symbols += genpas_spec_symbols;

	var skipAmbiguous = document.getElementById('skipamb').checked;

	// Исключаем неоднозначные символы если включено
	if (skipAmbiguous) {
		symbols = symbols.replace(/[B8G6I1l|0OQDS5Z2]/g, '');
	}

	var symblen = symbols.length;

	// Вычисляем энтропию
	var entropy_single = pwlen * Math.log2(symblen);
	var entropy_total = pwnum * pwlen * Math.log2(symblen);

	pass_cmnt.innerHTML = 'Режим Николая Пахомова: ' + pwnum + ' паролей по ' + pwlen + ' символов<br>' +
		'Один пароль: ' + Math.floor(entropy_single) + ' бит | Всего списка: ' + Math.floor(entropy_total) + ' бит';

	var pass_el = document.getElementById('pass');
	pass_el.innerHTML = '';

	// Генерируем пароли
	for (var j = 0; j < pwnum; j++) {
		var pw = '';
		for (var i = 0; i < pwlen; i++) {
			pw += symbols.charAt(gen_rand(0, symblen - 1));
		}
		pass_el.innerHTML += htmlspecialchars(pw) + '<br>';
	}

	pass_el.style.display = 'block';

	// Разблокируем кнопки
	genbutton.disabled = false;
	pakhomovButton.disabled = false;
}

function gen_pw2() {
	var pwlen = parseInt(document.getElementById('pwlen').value) || 12;
	var pwnum = parseInt(document.getElementById('pwnum').value) || 12;
	var symbols = '';

	if (document.getElementById('az').checked) symbols += 'abcdefghijklmnopqrstuvwxyz';
	if (document.getElementById('az2').checked) symbols += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (document.getElementById('n09').checked) symbols += '1234567890';
	if (document.getElementById('schr').checked) symbols += genpas_spec_symbols;

	var skipAmbiguous = document.getElementById('skipamb').checked;

	if (skipAmbiguous) {
		symbols = symbols.replace(/[B8G6I1l|0OQDS5Z2]/g, '');
	}

	var symblen = symbols.length;
	if (symblen == 0 && !document.getElementById('pwgen').checked) {
		document.getElementById('pass_cmnt').innerHTML = 'Выберите хотя бы один набор символов!';
		document.getElementById('genbutton').disabled = false;
		return;
	}

	var entropy_single = pwlen * Math.log2(symblen);
	var entropy_total = pwnum * pwlen * Math.log2(symblen);

	document.getElementById('pass_cmnt').innerHTML = 'Один пароль: ' + Math.floor(entropy_single) + ' бит | Всего списка: ' + Math.floor(entropy_total) + ' бит';

	var fullrand = document.getElementById('fullrand').checked;
	var pwgen_mode = document.getElementById('pwgen').checked;
	var pass_el = document.getElementById('pass');
	pass_el.innerHTML = '';

	for (var j = 0; j < pwnum; j++) {
		var pw = '';
		if (fullrand) {
			for (var i = 0; i < pwlen; i++) {
				pw += symbols.charAt(gen_rand(0, symblen - 1));
			}
		} else if (pwgen_mode) {
			// ВАЖНО: передаем 5 параметров!
			pw = pwgen_generate(
				pwlen,
				document.getElementById('az2').checked,
				document.getElementById('n09').checked,
				document.getElementById('schr').checked,
				skipAmbiguous  // 5-й параметр
			);
		} else {
			for (var i = 0; i < pwlen; i++) {
				pw += symbols.charAt(gen_rand(0, symblen - 1));
			}
		}

		if (pw) {
			pass_el.innerHTML += htmlspecialchars(pw) + '<br>';
		}
	}

	pass_el.style.display = 'block';
	document.getElementById('genbutton').disabled = false;
}

document.addEventListener('DOMContentLoaded', function () {
	var genbutton = document.getElementById('genbutton');
	genbutton.addEventListener('click', gen_pw);

	// Добавляем обработчик для кнопки Пахомова
	var pakhomovButton = document.getElementById('pakhomovButton');
	if (pakhomovButton) {
		pakhomovButton.addEventListener('click', gen_pakhomov_mode);
	}

	var fullrand = document.getElementById('fullrand');
	var pwgen = document.getElementById('pwgen');
	var skipamb = document.getElementById('skipamb');

	fullrand.addEventListener('change', function () {
		skipamb.disabled = false;
	});

	pwgen.addEventListener('change', function () {
		skipamb.disabled = false;
		skipamb.checked = false;
	});
});

document.addEventListener('DOMContentLoaded', function () {
	var genbutton = document.getElementById('genbutton');
	genbutton.addEventListener('click', gen_pw);

	var fullrand = document.getElementById('fullrand');
	var pwgen = document.getElementById('pwgen');
	var skipamb = document.getElementById('skipamb');

	fullrand.addEventListener('change', function () {
		skipamb.disabled = false;
	});

	pwgen.addEventListener('change', function () {
		// skipamb now enabled in pwgen mode
	});
});
