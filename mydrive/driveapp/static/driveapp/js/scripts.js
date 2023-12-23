
/* Функции для стиля */
function open_block(el){
    let block = el.parentNode.childNodes[3];
    block.classList.toggle('my_unactive');
}


function hide_block(el){
    let parent = el.parentNode.childNodes[3];
    
    parent.classList.toggle('my_active');
    parent.parentNode.classList.toggle('activ_block_trnsp');

    let par = el.parentNode.classList.toggle('my_scale');
}

//Открытие блока для карточек с в аренеде;
function hide_block_for_rent(el){
    let parent = el.parentNode.childNodes[3];
    
    parent.classList.toggle('my_active');
    parent.parentNode.classList.toggle('activ_block_trnsp');

    let par = el.parentNode.classList.toggle('my_scale');
}


//Функция для получения токенов;
function get_tokens(){
    let meta = document.getElementsByTagName('meta');
    let tokens = {};
    for(let i = 0; i < meta.length; i++){
        if(meta[i].name == 'csrfmiddlewaretoken'){
            tokens['ctoken'] = meta[i].content;
        }
        if(meta[i].name == 'token'){
            tokens['token'] = meta[i].content;
        }
    }
    return tokens;
}




function checkPass(el){
    let tp = el.parentNode.childNodes[0].type;
    if(tp == 'password'){
        el.parentNode.childNodes[0].type = 'text';
    }
    else{
        el.parentNode.childNodes[0].type = 'password';
    }
}

function checkPass1(el){
    let tp = el.parentNode.childNodes[1].type;

    if(tp == 'password'){
        el.parentNode.childNodes[1].type = 'text';
    }
    else{
        el.parentNode.childNodes[1].type = 'password';
    }
}




//Для регистрации;
function singUp_open_form(){
    let form = document.getElementsByClassName('my_form')[0];
    form.action = "signup";
    let title = document.getElementsByTagName('title')[0].innerHTML = 'Регистрация';
    let childs = form.childNodes;
    childs[7].innerHTML = "<h2>Регистрация</h2>";
    childs[13].classList.toggle('my_display_none');
    childs[13].innerHTML = `
        <div class="my_f_item_pass">
            <input type="password" name="duble_password" placeholder="Подтвердите пароль"><input class="check_spec_pass" type="checkbox" name="checkbox_for_pass" onclick="checkPass1(this)">
        </div>
    `;
    childs[15].innerHTML = '<input class="my_button" type="submit" value="Зарегистрироваться">';
    childs[17].innerHTML = '<div class="btn_for_act_start" onclick="singIn_open_form()">Авторизоваться</div>';
}

//Для авторизации;
function singIn_open_form(){
    let form = document.getElementsByClassName('my_form')[0];
    let title = document.getElementsByTagName('title')[0].innerHTML = 'Авторизация';
    form.action = "index";
    let childs = form.childNodes;
    childs[7].innerHTML = "<h2>Авторизация</h2>";
    //childs[13].innerHTML = '<input class="my_button" type="submit" value="Авторизация">';
    childs[13].classList.toggle('my_display_none');
    childs[13].innerHTML = "";
    childs[15].innerHTML = '<input class="my_button" type="submit" value="Авторизация">';
    childs[17].innerHTML = '<div class="btn_for_act_start" onclick="singUp_open_form()">Зарегистрироваться</div>';
}



//Выйти из приложения;
function SignOut_func(){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'signout', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            
            document.open();
            document.write(xhr.responseText);
            document.close();
            
            //console.log(xhr.responseText);
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            
            document.open();
            document.write(xhr.responseText);
            document.close();
            
            //console.log(xhr.responseText);
        }
    };
    xhr.send();
}






//sub_menu

// ||||||||||||||||||||||| Мой аккаунт |||||||||||||||||||||||
function get_acc_menu(el){
    let sub_menu = document.getElementsByClassName('sub_menu')[0];
    let main_block = document.getElementsByClassName('main_block')[0];
    sub_menu.innerHTML = "";
    main_block.innerHTML = "";

    sub_menu.innerHTML= `
        <div class="sub_menu_for_chapter">
            <div class="sub_menu_for_chapter_item" onclick="acc_info()">Информация</div>
            <div class="sub_menu_for_chapter_item" onclick="acc_change()">Изменение</div>
        </div>
    `;
}

//Получение информации о аккаунте;
function acc_info(){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Account/Me', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let acc_info = res['account'];
            
            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";

            main_block.innerHTML = `
                <div class="acc_info my_margin">
                    <div class="acc_info_item">
                            <p>ID:</p>
                            <p> ${acc_info['user_id']}</p>
                        </div>
                        <div class="acc_info_item">
                            <p>Имя:</p>
                            <p> ${acc_info['username']}</p>
                        </div>
                        <div class="acc_info_item">
                            <p>Баланс:</p>
                            <p> ${acc_info['balance']} руб</p>
                        </div>
                    </div>
                </div>
            `;

        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}

//Изменение аккаунта;
function acc_change(){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Account/Me', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let acc_info = res['account'];
            
            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";

            main_block.innerHTML = `
                <div class="my_form my_margin">
                    <div class="my_f_item my_margin">
                        <div><h3>ID аккаунта: ${acc_info['user_id']}</h3></div>
                    </div>
                    <div class="my_f_item my_margin">
                        <input type="text" name="username" placeholder="Ваше имя" value='${acc_info['username']}'>
                    </div>
                    <div class="my_f_item my_margin">
                        <div class="my_f_item_pass">
                            <input type="password" name="cur_password" placeholder="Текущий пароль"><input class="check_spec_pass" type="checkbox" name="checkbox_for_pass" onclick="checkPass1(this)">
                        </div>
                    </div>
                    <div class="my_f_item my_margin">
                        <div class="my_f_item_pass">
                            <input type="password" name="new_password" placeholder="Новый пароль"><input class="check_spec_pass" type="checkbox" name="checkbox_for_pass" onclick="checkPass1(this)">
                        </div>
                    </div>
                    <div class="my_f_item my_flex my_margin">
                        <button class="my_button" onclick="send_change_acc()">Изменить</button>
                    </div>
                </div>
            `;
            

        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}


//Запрос на сервер с информацией для изменения аккаунта;
function send_change_acc(){
    let tokens = get_tokens();

    let username = document.getElementsByName('username')[0].value;

    let cur_password = document.getElementsByName('cur_password')[0].value;
    let new_password = document.getElementsByName('new_password')[0].value;

    let sendData = {'token':tokens['token'], 'username':username, 'cur_password':cur_password, 'new_password':new_password};
    let jsonData = JSON.stringify(sendData);

    let xhr = new XMLHttpRequest();
    xhr.open('PUT', 'api/Account/Update', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            alert(res['response']);
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send(jsonData);
}




// ||||||||||||||||||||||| Мой транспорт |||||||||||||||||||||||
function get_trnsp_menu(el){
    let sub_menu = document.getElementsByClassName('sub_menu')[0];
    let main_block = document.getElementsByClassName('main_block')[0];
    sub_menu.innerHTML = "";
    main_block.innerHTML = "";

    sub_menu.innerHTML= `
        <div class="sub_menu_for_chapter">
            <div class="sub_menu_for_chapter_item" onclick="get_trnsp()">Мой транспорт</div>
            <div class="sub_menu_for_chapter_item" onclick="add_trnsp()">Добавить ТС</div>
        </div>
    `;
}

//Мой транспорт
function get_trnsp(){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Transport/My', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let transport = res['transport'];
            
            let temp = '';
            for(let i = 0; i < transport.length; i++){
                trnsp = transport[i];
                
                let rent = 'Арендуют';
                if(trnsp['canBeRented']){
                    rent = 'Свободно';
                }
                

               //Устанавливаем картинку;
               img_p = 'scooter.png'
               if(trnsp['transportType'] == 'мотоцикл'){
                img_p = 'bike.png'
               }
               if(trnsp['transportType'] == 'автомобиль'){
                img_p = 'car.png'
               }

                temp += `
                <div id="${trnsp['trnsp_id']}" class="trnsp_list_item">
                    <div class='trnsp_list_info'>
                        <div class="trnsp_head" onclick="hide_block(this)">
                            <div class="trnsp_head_mdl">
                                <p>${trnsp['model']}</p>
                                <p>${trnsp['dayPrice']} руб</p>
                            </div>
                            <div class="trnsp_head_img">
                                <img src="static/driveapp/img/${img_p}" alt="${trnsp['transportType']}">
                            </div>
                            <div class="trnsp_head_foot"><p>${rent}</p></div>
                        </div>
                        <div class="trnsp_info">
                            <div class="trnsp_info_item"><p>ID ТС:</p><p>${trnsp['trnsp_id']}</p></div>
                            <div class="trnsp_info_item"><p>Тип транспорта:</p><p>${trnsp['transportType']}</p></div>
                            <div class="trnsp_info_item"><p>Модель:</p><p>${trnsp['model']}</p></div>
                            <div class="trnsp_info_item"><p>Знак:</p><p>${trnsp['identifier']}</p></div>
                            <div class="trnsp_info_item"><p>Цвет:</p><p>${trnsp['color']}</p></div>
                            <div class="trnsp_info_item"><p>Местоположение:</p><p>${trnsp['position']}</p></div>
                            <div class="trnsp_info_item"><p>Г. шир:</p><p>${trnsp['latitude']}</p></div>
                            <div class="trnsp_info_item"><p>Г. долг:</p><p>${trnsp['longitude']}</p></div>
                            <div class="trnsp_info_item"><p>Цена за минуту:</p><p>${trnsp['minutePrice']}</p></div>
                            <div class="trnsp_info_item"><p>Цена за день:</p><p>${trnsp['dayPrice']}</p></div>
                            <div class="trnsp_info_item"><p>Описание:</p><p>${trnsp['description']}</p></div>
                        </div>
                        <div class="trnsp_foother">
                            <div><button class="btn_f_tr" onclick="open_my_modal_for_his_retn_trnsp(this)">История</button></div>
                            <div><button class="btn_f_tr" onclick="open_my_modal_for_change(this)">Изменить</button></div>
                            <div><button class="btn_f_tr" onclick="send_delete_trnsp(this)">Удалить</button></div>
                        </div>
                    </div>
                </div>
                `;
            }

            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";

            main_block.innerHTML = `
            <div class="trnsp_list">
                ${temp}
            </div>
            `;
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}

//Добавить ТС
function add_trnsp(){
    let tokens = get_tokens();
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Rent/Points', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let points = JSON.parse(xhr.responseText)['rent_points']; //Пункты аренды;
            
            temp = "";
            for(let i = 0; i < points.length; i++){
                temp += `<option value="${points[i]['lat']}; ${points[i]['long']}">${points[i]['name']}</option>`;
            }

            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";

            main_block.innerHTML = `
                <div class="my_form my_margin">
                <div class="my_f_item my_margin"><h2>Добавить ТС</h2></div>
                    <div class="my_f_item my_margin"><input id="model" type="text" placeholder="Модель"></div>
                    <div class="my_f_item my_margin">
                        <select id='transportType'>
                            <option value="автомобиль">Автомобиль</option>
                            <option value="мотоцикл">Мотоцикл</option>
                            <option value="самокат">Самокат</option>
                        </select>
                    </div>
                    <div class="my_f_item my_margin"><input id="identifier" type="text" placeholder="Номер"></div>
                    <div class="my_f_item my_margin"><input id="color" type="text" placeholder="Цвет"></div>

                    <div class="my_f_item_for_select my_margin">
                        <h4>Местоположение</h4>
                        <select id='position'>
                            ${temp}
                        </select>
                    </div>

                    <div class="my_f_item my_margin"><input id="minutePrice" type="number" placeholder="Цена за минуту"></div>
                    <div class="my_f_item my_margin"><input id="dayPrice" type="number" placeholder="Цена за день"></div>

                    <div class="my_f_item my_margin"><div class='my_f_item_sub'>Доступно для аренды?<input id="canBeRented" type="checkbox"></div></div>
                    <div class="my_f_item my_margin"><textarea id="description" placeholder="Описание"></textarea></div>
                    <div class="my_f_item my_margin"><button class="my_button" onclick="send_add_trnsp()">Добавить</button></div>
                </div>
            `;
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}


//Отправка запроса на сервер с данными о ТС
function send_add_trnsp(){
    let tokens = get_tokens();

    let canBeRented = document.getElementById('canBeRented').checked;
    let transportType = document.getElementById('transportType').value;
    let model = document.getElementById('model').value;
    let color = document.getElementById('color').value;
    let identifier = document.getElementById('identifier').value;

    let description = document.getElementById('description').value;

    let minutePrice = document.getElementById('minutePrice').value;
    let dayPrice = document.getElementById('dayPrice').value;

    //Определение координат местоположения ТС;
    let pos = document.getElementById('position').childNodes; //Дочерние элементы select;
    let lat, long; 
    for(let i = 0; i < pos.length; i++){
        if(pos[i].selected){
            let cord = pos[i].value.split("; ");
            lat = cord[0];
            long = cord[1];
        }
    }    

    let sendData = {
            "token": tokens['token'],
            "canBeRented": canBeRented,
            "transportType": transportType,
            "model": model,
            "color": color,
            "identifier": identifier,
            "description": description,
            "latitude": lat,
            "longitude": long,
            "minutePrice": minutePrice,
            "dayPrice": dayPrice
    };
    let jsonData = JSON.stringify(sendData);

    
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/Transport', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            alert(res['response']);
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send(jsonData);
    
}


//Удаление транспорта;
function send_delete_trnsp(el){
    let trnsp_id = el.parentNode.parentNode.parentNode.parentNode.id;

    if(confirm("Удалить ТС с ID: " + trnsp_id + "?")){
        tokens = get_tokens();
        
        let sendData = {"token":tokens['token']};
        let jsonData = JSON.stringify(sendData);
        
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'api/TransportDelete/' + trnsp_id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let res = JSON.parse(xhr.responseText);
                alert(res['response']);
                get_trnsp();
            }
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
                let res = JSON.parse(xhr.responseText);
                alert(res['exception']);
            }
        };
        xhr.send(jsonData);
    }
}




// ||||||||||||||||||||||| Аренда |||||||||||||||||||||||
function get_rent_menu(el){
    let sub_menu = document.getElementsByClassName('sub_menu')[0];
    let main_block = document.getElementsByClassName('main_block')[0];
    sub_menu.innerHTML = "";
    main_block.innerHTML = "";

    sub_menu.innerHTML= `
        <div class="sub_menu_for_chapter">
            <div class="sub_menu_for_chapter_item" onclick="get_my_rents()">Мои аренды</div>
            <div class="sub_menu_for_chapter_item" onclick="get_my_his_rents()">История аренд</div>
            <div class="sub_menu_for_chapter_item" onclick="add_rent()">Аренда</div>
        </div>
    `;    
}

//Мои аренды
function get_my_rents(){
    tokens = get_tokens();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Rent/MyRents', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let rents = res['my_rents'];

            if(rents.length > 0){
                let temp = '';
                for(let i = 0; i < rents.length; i++){
                    rent = rents[i];
    
                    temp += `
                        <div id="${rent['rent_id']}" class="trnsp_list_item">
                            <div class='trnsp_list_info'>
                                <div class="trnsp_head" onclick="hide_block(this)">
                                    <div class="trnsp_head_mdl">
                                        <div><p>Model</p></div>
                                        <div class="for_my_rent_head">
                                            <p>${rent['rentprice']} руб</p>
                                            <p>${rent['renttype']}</p>
                                        </div>
                                    </div>
                                    <div class="trnsp_head_img"></div>
                                    <div class="trnsp_head_foot for_rent">
                                        <p>Время начала:</p>
                                        <p>${rent['rent_start']}</p>
                                    </div>
                                </div>
                                <div class="trnsp_info">
                                    <div class="trnsp_info_item"><p>ID аренды:</p><p>${rent['rent_id']}</p></div>
                                    <div class="trnsp_info_item"><p>ID транспорта:</p><p>${rent['trnsp_id']}</p></div>
                                    <div class="trnsp_info_item"><p>Тип аренды:</p><p>${rent['renttype']}</p></div>
                                    <div class="trnsp_info_item"><p>Цена:</p><p>${rent['rentprice']}</p></div>
                                    <div class="trnsp_info_item"><p>Описание:</p><p>${rent['description']}</p></div>
                                    <div class="trnsp_info_item"><p>Пункт начала:</p><p>${rent['rent_point_start']}</p></div>
                                    <div class="trnsp_info_item"><p>Время начала:</p><p>${rent['rent_start']}</p></div>
                                </div>
                                <div class="trnsp_foother">
                                    <div><button class="btn_f_tr" onclick="send_end_rent(this)">Завершить</button></div>
                                </div>
                            </div>
                        </div>
                    `;
                }
    
                let main_block = document.getElementsByClassName('main_block')[0];
                main_block.innerHTML = "";
                main_block.innerHTML = `
                    <div class="trnsp_list">    
                        ${temp}
                    </div>
                `;
            }
            else{
                let main_block = document.getElementsByClassName('main_block')[0];
                main_block.innerHTML = "";
                main_block.innerHTML = `
                `;
                alert('Действующие аренды отсутствуют');
            }
            
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}




//История аренд
function get_my_his_rents(){
    tokens = get_tokens();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Rent/MyHistory', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let rents = res['rent_info'];

            let temp = "";
            for(let i = 0; i < rents.length; i++){
                rent = rents[i];

                temp += `
                    <div id="${rent['rent_id']}" class="trnsp_list_item">
                        <div class='trnsp_list_info'>
                            <div class="trnsp_head" onclick="hide_block(this)">
                                <div class="trnsp_head_mdl">
                                    <div><p>Model</p></div>
                                    <div class="for_my_rent_head">
                                        <p>${rent['rentprice']} руб</p>
                                        <p>${rent['renttype']}</p>
                                    </div>
                                </div>
                                <div class="trnsp_head_img"></div>
                                <div class="trnsp_head_foot for_rent">
                                    <div>
                                        <p>Время начала:</p>
                                        <p>${rent['rent_start ']}</p>
                                    </div>
                                    <div>
                                        <p>Окончание аренды:</p>
                                        <p>${rent['rent_finish']}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trnsp_info">
                                <div class="trnsp_info_item"><p>ID аренды:</p><p>${rent['rent_id']}</p></div>
                                <div class="trnsp_info_item"><p>ID пользователя:</p><p>${rent['user_id']}</p></div>
                                <div class="trnsp_info_item"><p>ID транспорта:</p><p>${rent['trnsp_id']}</p></div>
                                <div class="trnsp_info_item"><p>Тип аренды:</p><p>${rent['renttype']}</p></div>
                                <div class="trnsp_info_item"><p>Цена:</p><p>${rent['rentprice']}</p></div>
                                <div class="trnsp_info_item"><p>Описание:</p><p>${rent['description']}</p></div>
                                <div class="trnsp_info_item"><p>Пункт начала:</p><p>${rent['rent_point_start']}</p></div>
                                <div class="trnsp_info_item"><p>Пункт завершения:</p><p>${rent['rent_point_finish']}</p></div>
                                <div class="trnsp_info_item"><p>Время начала:</p><p>${rent['rent_start ']}</p></div>
                                <div class="trnsp_info_item"><p>Время завершения:</p><p>${rent['rent_finish']}</p></div>
                            </div>
                            <div class="trnsp_foother">
                            </div>
                        </div>
                    </div>
                `;
            }


            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";
            main_block.innerHTML = `
                <div class="trnsp_list">
                    ${temp}
                </div>
            `;
            
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}


//Глобальная переменная с транспортом
//window.trnsp_list_all;
//Функция для сортировки транспорта на странице;
function sort_show_trnsp_list(type_sort){
    let trnsp;
    //Сортировка;
    if(window.trnsp_list_all.length == 0){
        return 0;
    }

    if(type_sort == "sortType1" || type_sort == "sortType2"){
        trnsp = window.trnsp_list_all.sort(compareByDayPrice);
    }
    else{
        trnsp = window.trnsp_list_all.sort(compareByMinutePrice);
    }

    //Добавление на страницу;
    let temp = '';
    if(type_sort == "sortType1" || type_sort == "sortType3"){
        for(let i = 0; i < trnsp.length; i++){
            trns = trnsp[i];
            
            //Устанавливаем картинку;
            img_p = 'scooter.png'
            if(trns['transportType'] == 'мотоцикл'){
             img_p = 'bike.png'
            }
            if(trns['transportType'] == 'автомобиль'){
             img_p = 'car.png'
            }

            
            temp += `
                <div id="${trns['trnsp_id']}" class="trnsp_list_item">
                    <div class='trnsp_list_info'>
                        <div class="trnsp_head" onclick="hide_block_for_rent(this)">
                            <div class="trnsp_head_mdl">
                                <p>${trns['model']}</p>
                                <p>${trns['dayPrice']} руб</p>
                            </div>
                            <div class="trnsp_head_img">
                                <img src="static/driveapp/img/${img_p}" alt="${trns['transportType']}">
                            </div>
                            <div class="trnsp_head_foot for_rent">
                                <p>Местоположение:</p>
                                <p>${trns['latitude']}; ${trns['longitude']}</p>
                            </div>
                        </div>
                        <div class="trnsp_info">
                            <div class="trnsp_info_item"><p>ID ТС:</p><p>${trns['trnsp_id']}</p></div>
                            <div class="trnsp_info_item"><p>Модель:</p><p>${trns['model']}</p></div>
                            <div class="trnsp_info_item"><p>Знак:</p><p>${trns['identifier']}</p></div>
                            <div class="trnsp_info_item"><p>Цвет:</p><p>${trns['color']}</p></div>
                            <div class="trnsp_info_item"><p>Местоположение:</p><p>${trns['position']}</p></div>
                            <div class="trnsp_info_item"><p>Г. шир:</p><p>${trns['latitude']}</p></div>
                            <div class="trnsp_info_item"><p>Г. долг:</p><p>${trns['longitude']}</p></div>
                            <div class="trnsp_info_item"><p>Цена за минуту:</p><p>${trns['minutePrice']}</p></div>
                            <div class="trnsp_info_item"><p>Цена за день:</p><p>${trns['dayPrice']}</p></div>
                            <div class="trnsp_info_item"><p>Описание:</p><p>${trns['description']}</p></div>
                        </div>
                        <div class="trnsp_foother">
                            <div><button class="btn_f_tr" onclick="send_add_rent(this)">Арендовать</button></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    else{
        for(let i = trnsp.length-1; i >= 0; i--){
            trns = trnsp[i];
            //Устанавливаем картинку;
            img_p = 'scooter.png'
            if(trns['transportType'] == 'мотоцикл'){
                img_p = 'bike.png'
            }
            if(trns['transportType'] == 'автомобиль'){
                img_p = 'car.png'
            }


            temp += `
                <div id="${trns['trnsp_id']}" class="trnsp_list_item">
                    <div class='trnsp_list_info'>
                        <div class="trnsp_head" onclick="hide_block_for_rent(this)">
                            <div class="trnsp_head_mdl">
                                <p>${trns['model']}</p>
                                <p>${trns['dayPrice']} руб</p>
                            </div>
                            <div class="trnsp_head_img">
                                <img src="static/driveapp/img/${img_p}" alt="${trns['transportType']}">
                            </div>
                            <div class="trnsp_head_foot for_rent">
                                <p>Местоположение:</p>
                                <p>${trns['latitude']}; ${trns['longitude']}</p>
                            </div>
                        </div>
                        <div class="trnsp_info">
                            <div class="trnsp_info_item"><p>ID ТС:</p><p>${trns['trnsp_id']}</p></div>
                            <div class="trnsp_info_item"><p>Модель:</p><p>${trns['model']}</p></div>
                            <div class="trnsp_info_item"><p>Знак:</p><p>${trns['identifier']}</p></div>
                            <div class="trnsp_info_item"><p>Цвет:</p><p>${trns['color']}</p></div>
                            <div class="trnsp_info_item"><p>Местоположение:</p><p>${trns['position']}</p></div>
                            <div class="trnsp_info_item"><p>Г. шир:</p><p>${trns['latitude']}</p></div>
                            <div class="trnsp_info_item"><p>Г. долг:</p><p>${trns['longitude']}</p></div>
                            <div class="trnsp_info_item"><p>Цена за минуту:</p><p>${trns['minutePrice']}</p></div>
                            <div class="trnsp_info_item"><p>Цена за день:</p><p>${trns['dayPrice']}</p></div>
                            <div class="trnsp_info_item"><p>Описание:</p><p>${trns['description']}</p></div>
                        </div>
                        <div class="trnsp_foother">
                            <div><button class="btn_f_tr" onclick="send_add_rent(this)">Арендовать</button></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    let trnsp_list = document.getElementsByClassName('trnsp_list')[0];
    trnsp_list.innerHTML = "";
    trnsp_list.innerHTML = temp;
}


//Создать аренду
function add_rent(){
    tokens = get_tokens();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Rent/Transport', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.setRequestHeader('lat', 57);
    xhr.setRequestHeader('long', 37);
    xhr.setRequestHeader('radius', 50);
    xhr.setRequestHeader('type', 'all');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let trnsp = res['transports_for_rents'];
            window.trnsp_list_all = res['transports_for_rents'];
            
            let temp = '';
            for(let i = 0; i < trnsp.length; i++){
                trns = trnsp[i];
                
                //Устанавливаем картинку;
                img_p = 'scooter.png'
                if(trns['transportType'] == 'мотоцикл'){
                    img_p = 'bike.png'
                }
                if(trns['transportType'] == 'автомобиль'){
                    img_p = 'car.png'
                }

                temp += `
                    <div id="${trns['trnsp_id']}" class="trnsp_list_item">
                        <div class='trnsp_list_info'>
                            <div class="trnsp_head" onclick="hide_block_for_rent(this)">
                                <div class="trnsp_head_mdl">
                                    <p>${trns['model']}</p>
                                    <p>${trns['dayPrice']} руб</p>
                                </div>
                                <div class="trnsp_head_img">
                                    <img src="static/driveapp/img/${img_p}" alt="${trns['transportType']}">
                                </div>
                                <div class="trnsp_head_foot for_rent">
                                    <p>Местоположение:</p>
                                    <p>${trns['latitude']}; ${trns['longitude']}</p>
                                </div>
                            </div>
                            <div class="trnsp_info">
                                <div class="trnsp_info_item"><p>ID ТС:</p><p>${trns['trnsp_id']}</p></div>
                                <div class="trnsp_info_item"><p>Модель:</p><p>${trns['model']}</p></div>
                                <div class="trnsp_info_item"><p>Знак:</p><p>${trns['identifier']}</p></div>
                                <div class="trnsp_info_item"><p>Цвет:</p><p>${trns['color']}</p></div>
                                <div class="trnsp_info_item"><p>Местоположение:</p><p>${trns['position']}</p></div>
                                <div class="trnsp_info_item"><p>Г. шир:</p><p>${trns['latitude']}</p></div>
                                <div class="trnsp_info_item"><p>Г. долг:</p><p>${trns['longitude']}</p></div>
                                <div class="trnsp_info_item"><p>Цена за минуту:</p><p>${trns['minutePrice']}</p></div>
                                <div class="trnsp_info_item"><p>Цена за день:</p><p>${trns['dayPrice']}</p></div>
                                <div class="trnsp_info_item"><p>Описание:</p><p>${trns['description']}</p></div>
                            </div>
                            <div class="trnsp_foother">
                                <div><button class="btn_f_tr" onclick="send_add_rent(this)">Арендовать</button></div>
                            </div>
                        </div>
                    </div>
                `;
            }

            let xhr1 = new XMLHttpRequest();
            xhr1.open('GET', 'api/Rent/Points', true);
            xhr1.setRequestHeader('Content-Type', 'application/json');
            xhr1.setRequestHeader('X-CSRFToken', tokens['ctoken']);
            xhr1.setRequestHeader('token', tokens['token']);
            xhr1.onreadystatechange = function() {
                if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
                    let points = JSON.parse(xhr1.responseText)['rent_points']; //Пункты аренды;
                    //console.log(points);
                    temp1 = "";
                    for(let i = 0; i < points.length; i++){
                        temp1 += `<option value="${points[i]['lat']}; ${points[i]['long']}">${points[i]['name']}</option>`;
                    }

                    let main_block = document.getElementsByClassName('main_block')[0];
                    main_block.innerHTML = "";
                    main_block.innerHTML = `
                    <div class="my_form my_margin">
                        <div class="my_f_item my_margin"><h2>Найти транспорт</h2></div>
                        <div class="my_f_item my_margin">
                            <select id='transportType'>
                                <option value="car">Автомобиль</option>
                                <option value="bike">Мотоцикл</option>
                                <option value="schooter">Самокат</option>
                                <option value="all">Любой</option>
                            </select>
                        </div>
                            
                            <div class="my_f_item_for_select my_margin">
                                <h3>Местоположение</h3>
                                <select id='position' class="my_margin">
                                    ${temp1}
                                </select>
                            </div>
                            
                            <div class="my_f_item my_margin"><h3>Ценовой диапазон</h3></div>
                            
                            <div class="my_f_item my_margin">     
                                <form class='form_for_radio'>
                                    <label><input type="radio" name="rad" value="dayPrice" checked>Цена за день</label>
                                    <label><input type="radio" name="rad" value="minutePrice">Цена за минуту</label>
                                </form>
                            </div>

                            <div class="my_f_item my_margin">
                                <div class="sub2 my_margin">
                                    <input id="lowPrice" type="number" min=0 placeholder="Минимум">
                                    <input id="HighPrice" type="number" min=0 placeholder="Максимум">
                                </div>
                            </div>
                            
                            <div class="my_f_item my_margin">
                                <select id='sortList'>
                                    <option value="sortType1">По цене за день, от меньшей к большей</option>
                                    <option value="sortType2">По цене за день, от большей к меньшей</option>
                                    <option value="sortType3">По цене за минуту, от меньшей к большей</option>
                                    <option value="sortType4">По цене за минуту, от большей к меньшей</option>
                                </select>
                            </div>
                        
                            <div class="my_f_item my_margin">
                            <button class="my_button" onclick="send_find_trnsp()">Найти</button>
                        </div>
                    </div>

                    <div class="trnsp_list my_margin">
                        ${temp}
                    </div>
                    `;

                    //Событие на изменения сортировки на страницы при выборе другого порядка;
                    let sortList = document.getElementById('sortList');
                    sortList.addEventListener('change', (event) => {
                        sort_show_trnsp_list(sortList.value);
                    });

                }
                if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 400){ //Если ошибка;
                    alert('Пункты аренды не найдены');
                }
            };
            xhr1.send();
            
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}



//Функция для сравнения по цене за день;
function compareByDayPrice(a, b) {
    return a.dayPrice - b.dayPrice;
}
  
//Функция для сравнения по цене за минуту;
function compareByMinutePrice(a, b) {
    return a.minutePrice - b.minutePrice;
}



//Отправка на сервер запроса с поиском ТС, доступного для аренды;
function send_find_trnsp(){
    let tokens = get_tokens();
    let type = document.getElementById('transportType').value;

    //Определение координат местоположения ТС;
    let pos = document.getElementById('position').childNodes; //Дочерние элементы select;
    let lat, long; 
    for(let i = 0; i < pos.length; i++){
        if(pos[i].selected){
            let cord = pos[i].value.split("; ");
            lat = cord[0];
            long = cord[1];
        }
    }  
    
    //Определение диапазона цен;
    let pmin = document.getElementById('lowPrice').value;
    let pmax = document.getElementById('HighPrice').value;

    //Значения по умолчанию, на цены;
    if(pmin == ''){
        pmin = 0;
    }
    if(pmax == ''){
        pmax = 10000;
    }

    //Определение цены;
    let rad = document.getElementsByName('rad');
    let price = '';
    for(let i = 0; i < rad.length; i++){
        if(rad[i].checked){
            price = rad[i].value;
        }
    }

    //Определение порядка сортировки;
    let type_sort = document.getElementById('sortList').value;
  
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Rent/TransportPl', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.setRequestHeader('lat', lat);
    xhr.setRequestHeader('long', long);
    xhr.setRequestHeader('radius', 0.00005);
    xhr.setRequestHeader('type', type);
    xhr.setRequestHeader('price', price);
    xhr.setRequestHeader('pmin', pmin);
    xhr.setRequestHeader('pmax', pmax);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText)['transports_for_rents'];
            if(res.length == 0){
                alert('Транспорт не найден');
            }
            else{
                window.trnsp_list_all = res;
            //console.log(res);
            //Отображение на страницы ТС в отсортированном порядке;
            sort_show_trnsp_list(type_sort);
            }
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}





/* Закрытие модального окна */
function close_my_modal(){
    let modal = document.getElementsByClassName('my_modal')[0];
    modal.innerHTML = "";

    modal.classList.toggle('my_modal_unactive');

    let body = document.getElementsByTagName('body')[0];
    body.classList.toggle('body_scr_n'); //Включаем скролл у body;
}



//Модальное окно для изменения ТС;
function open_my_modal_for_change(el){
    let tokens = get_tokens();
    let body = document.getElementsByTagName('body')[0];
    body.classList.toggle('body_scr_n'); //Выключаем скролл у body;

    let trnsp_id = el.parentNode.parentNode.parentNode.parentNode.id;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Transport/' + trnsp_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            transport = data['transport'];


            let xhr1 = new XMLHttpRequest();
            xhr1.open('GET', 'api/Rent/Points', true);
            xhr1.setRequestHeader('Content-Type', 'application/json');
            xhr1.setRequestHeader('X-CSRFToken', tokens['ctoken']);
            xhr1.setRequestHeader('token', tokens['token']);
            xhr1.onreadystatechange = function() {
                if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
                    let points = JSON.parse(xhr1.responseText)['rent_points'];

                    let temp1 = '';
                    for(let j = 0; j < points.length; j++){
                        if(transport['position'] == points[j]['name']){
                            temp1 += `<option selected value="${points[j]['lat']}; ${points[j]['long']}">${points[j]['name']}</option>`;
                        }
                        else{
                            temp1 += `<option value="${points[j]['lat']}; ${points[j]['long']}">${points[j]['name']}</option>`;
                        }
                    }

                    let modal = document.getElementsByClassName('my_modal')[0];
                    modal.classList.toggle('my_modal_unactive'); //Включаем модальное окно;
                    modal.innerHTML = `
                        <div class="my_modal_close"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                        <div class="my_modal_body">
                            <div id="${trnsp_id}" class="my_form my_margin">
                                    <div class="my_f_item my_margin"><h2>Изменить ТС ID: ${trnsp_id}</h2></div>
                                    <div class="my_f_item my_margin"><input id="model" type="text" placeholder="Модель" value="${transport['model']}"></div>
                                    <div class="my_f_item my_margin"><input id="identifier" type="text" placeholder="Номер" value="${transport['identifier']}"></div>
                                    <div class="my_f_item my_margin"><input id="color" type="text" placeholder="Цвет" value="${transport['color']}"></div>
                                                                
                                    <div class="my_f_item_for_select my_margin">
                                        <h3>Местоположение</h3>
                                        <select id='position' class="my_margin">
                                            ${temp1}
                                        </select>
                                    </div>

                                    <div class="my_f_item my_margin"><input id="minutePrice" type="number" placeholder="Цена за минуту" value="${transport['minutePrice']}"></div>
                                    <div class="my_f_item my_margin"><input id="dayPrice" type="number" placeholder="Цена за день" value="${transport['dayPrice']}"></div>
                        
                                    <div class="my_f_item my_margin"><div class='my_f_item_sub'>Доступно для аренды?<input id="canBeRented" type="checkbox" checked='${transport['canBeRented']}'></div></div>
                                    <div class="my_f_item my_margin"><textarea id="description" placeholder="Описание" value="${transport['description']}"></textarea></div>
                                    <div class="my_f_item my_margin"><button class="my_button" onclick="send_change_trnsp(this)">Изменить</button></div>
                                </div>
                        </div>
                    `;

                    let desk = document.getElementById('description').value = transport['description'];

                }
                if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 400) {
                    let response = JSON.parse(xhr.responseText);
                    alert(response['exception']);
                }
            };
            xhr1.send();
        
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
            let response = JSON.parse(xhr.responseText);
            alert(response['exception']);
        }
    };
    xhr.send();
}


//Отправка запроса на сервер с информацией о ТС для изменения;
function send_change_trnsp(el){
    tokens = get_tokens();

    let trnsp_id = el.parentNode.parentNode.id;

    let canBeRented = document.getElementById('canBeRented').checked;
    let model = document.getElementById('model').value;
    let color = document.getElementById('color').value;
    let identifier = document.getElementById('identifier').value;

    let description = document.getElementById('description').value;
    let minutePrice = document.getElementById('minutePrice').value;
    let dayPrice = document.getElementById('dayPrice').value;

    //Определение координат местоположения ТС;
    let pos = document.getElementById('position').childNodes; //Дочерние элементы select;
    let lat, long; 
    for(let i = 0; i < pos.length; i++){
        if(pos[i].selected){
            let cord = pos[i].value.split("; ");
            lat = cord[0];
            long = cord[1];
        }
    }  

    let sendData = {
        "token": tokens['token'],
        "canBeRented": canBeRented,
        "model": model,
        "color": color,
        "identifier": identifier,
        "description": description,
        "latitude": lat,
        "longitude": long,
        "minutePrice": minutePrice,
        "dayPrice": dayPrice
    };
    let jsonData = JSON.stringify(sendData);


    let xhr = new XMLHttpRequest();
    xhr.open('PUT', 'api/TransportUpdate/' + trnsp_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            alert(response['response']);
            close_my_modal();
            get_trnsp();
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
            let response = JSON.parse(xhr.responseText);
            alert(response['exception']);
        }
    };
    xhr.send(jsonData);
}




//Модальное окно с историей аренд транспорта;
function open_my_modal_for_his_retn_trnsp(el){
    let trnsp_id = el.parentNode.parentNode.parentNode.parentNode.id;

    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Rent/TransportHistory/' + trnsp_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let rents = res['rent_info'];

            if(rents.length < 1){
                alert('Транспорт не был в аренде');
                return 0;
            }

            let temp = "";
            for(let i = 0; i < rents.length; i++){
                rent = rents[i];

                temp += `
                    <div id="${rent['rent_id']}" class="trnsp_list_item">
                        <div class='trnsp_list_info'>
                            <div class="trnsp_head" onclick="hide_block(this)">
                                <div class="trnsp_head_mdl">
                                    <div><p>Model</p></div>
                                    <div class="for_my_rent_head">
                                        <p>${rent['rentprice']} руб</p>
                                        <p>${rent['renttype']}</p>
                                    </div>
                                </div>
                                <div class="trnsp_head_img"></div>
                                <div class="trnsp_head_foot for_rent">
                                    <div>
                                        <p>Время начала:</p>
                                        <p>${rent['rent_start ']}</p>
                                    </div>
                                    <div>
                                        <p>Окончание аренды:</p>
                                        <p>${rent['rent_finish']}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trnsp_info">
                                <div class="trnsp_info_item"><p>ID аренды:</p><p>${rent['rent_id']}</p></div>
                                <div class="trnsp_info_item"><p>ID пользователя:</p><p>${rent['user_id']}</p></div>
                                <div class="trnsp_info_item"><p>ID транспорта:</p><p>${rent['trnsp_id']}</p></div>
                                <div class="trnsp_info_item"><p>Тип аренды:</p><p>${rent['renttype']}</p></div>
                                <div class="trnsp_info_item"><p>Цена:</p><p>${rent['rentprice']}</p></div>
                                <div class="trnsp_info_item"><p>Описание:</p><p>${rent['description']}</p></div>
                                <div class="trnsp_info_item"><p>Пункт начала:</p><p>${rent['rent_point_start']}</p></div>
                                <div class="trnsp_info_item"><p>Пункт завершения:</p><p>${rent['rent_point_finish']}</p></div>
                                <div class="trnsp_info_item"><p>Время начала:</p><p>${rent['rent_start ']}</p></div>
                                <div class="trnsp_info_item"><p>Время завершения:</p><p>${rent['rent_finish']}</p></div>
                            </div>
                            <div class="trnsp_foother">
                            </div>
                        </div>
                    </div>
                `;
            }

            let body = document.getElementsByTagName('body')[0];
            body.classList.toggle('body_scr_n'); //Выключаем скролл у body;

            let modal = document.getElementsByClassName('my_modal')[0];
            modal.classList.toggle('my_modal_unactive'); //Включаем модальное окно;
            modal.innerHTML = `
                <div class="my_modal_close my_margin"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                <div class="my_modal_body my_margin">
                    <div class="container">
                        <div class="trnsp_list">
                            ${temp}
                        </div>
                    </div>
                </div>
            `;
            
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}



//Завершение аренды - модельное окно;
function send_end_rent(el){
    let tokens = get_tokens();
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Rent/Points', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let points = JSON.parse(xhr.responseText)['rent_points'];
            
            let temp = '';
            for(let i = 0; i < points.length; i++){
                temp += `<option value='${points[i]['name']}'>${points[i]['name']}</option>`;
            }

            let body = document.getElementsByTagName('body')[0];
            body.classList.toggle('body_scr_n'); //Выключаем скролл у body;

            let rent_id = el.parentNode.parentNode.parentNode.parentNode.id;

            let modal = document.getElementsByClassName('my_modal')[0];
            modal.classList.toggle('my_modal_unactive'); //Включаем модальное окно;
            modal.innerHTML = `
                <div class="my_modal_close"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                <div class="my_modal_body">
                    <div id="${rent_id}" class='my_form'>
                        <div class="my_f_item my_margin"><h2>Завершение аренды</h2></div>
                        <div class="my_f_item_for_select my_margin">
                            <h3>Пункт завершения аренды</h3>
                            <select id='position' class="my_margin">
                                ${temp}
                            </select>
                        </div>
                        <div class="my_f_item my_margin"><button class="my_button" onclick="send_end_rent_data(this)">Завершить</button></div>
                    </div>
                </div>
            `;
        }
    };
    xhr.send();
}

//Отправка на сервер запроса с информацией о завершении аренды;
function send_end_rent_data(el){
    let rent_id = el.parentNode.parentNode.id;
    let tokens = get_tokens();

    let position = document.getElementById('position').value;

    let sendData = {
        "token": tokens['token'],
        "rent_point_finish": position
    }
    let jsonData = JSON.stringify(sendData);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/Rent/End/' + rent_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 201) {
            let response = JSON.parse(xhr.responseText)['response'];
            
            close_my_modal();
            alert(response);
            get_my_rents();
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
            let response = JSON.parse(xhr.responseText)['exception'];
            alert(response);
        }
    };
    xhr.send(jsonData);
    
}





//Создание аренды - модальное окно;
function send_add_rent(el){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Rent/Points', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText)['rent_points'];
            
            let temp1 = '';
            for(let i = 0; i < response.length; i++){
                temp1 += `<option value='${response[i]['name']}'>${response[i]['name']}</option>`;
            }
            
            let body = document.getElementsByTagName('body')[0];
            body.classList.toggle('body_scr_n'); //Выключаем скролл у body;
        
            let trnsp_id = el.parentNode.parentNode.parentNode.parentNode.id;
        
            let today = new Date();
            let year = today.getFullYear();
            let mont = today.getMonth();
            let day = today.getDate();
            
            let modal = document.getElementsByClassName('my_modal')[0];
            modal.classList.toggle('my_modal_unactive'); //Включаем модальное окно;
            modal.innerHTML = `
                <div class="my_modal_close"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                <div class="my_modal_body my_margin">
                    <div id="${trnsp_id}" class='my_form'>
                        <div class="my_f_item my_margin"><h2>Арендовать</h2></div>
                        <div class="my_f_item my_margin">
                            <select id='rent_type'>
                                <option value="минуты">Минуты</option>
                                <option value="день">День</option>
                                <option value="5 дней">5 дней</option>
                                <option value="1 неделя">1 неделя</option>
                                <option value="2 недели">2 недели</option>
                            </select>
                        </div>
                        <div class="my_f_item_for_select my_margin">
                            <h4>Место начала аренды</h4>
                            <select id='position' class="my_margin">
                                ${temp1}
                            </select>
                        </div>
                        <div class="my_f_item my_margin"><input id='datetime' type='datetime-local'  placeholder='Дата и время' min='${year + "-" + mont + "-" + day}' required></div>
                        <div class="my_f_item my_margin"><textarea id="description" placeholder="Описание"></textarea></div>
                        <div class="my_f_item my_margin"><button class="my_button" onclick="send_for_server_rent(${trnsp_id})">Арендовать</button></div>
                    </div>
                </div>
            `;
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
            let response = JSON.parse(xhr.responseText);
            alert(response['exception']);
        }
    };
    xhr.send();
}

//Отправка данных на сервер с информацией о аренде;
function send_for_server_rent(trnsp_id){

    let datetime = document.getElementById('datetime').value;
        
    if(datetime == ''){
        alert('Установите дату и время начала аренды');
    }
    else{
        let tokens = get_tokens();
    
        let description = document.getElementById('description').value;
        let rent_type = document.getElementById('rent_type').value;

        let position = document.getElementById('position').value;

        let sendData = {
            "token": tokens['token'],
            "position": position,
            "timestart": datetime,
            "description":description,
            "rent_type":rent_type,
            'time_start':datetime
        }
        let jsonData = JSON.stringify(sendData);
        
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'api/Rent/New/' + trnsp_id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 201) {
                let response = JSON.parse(xhr.responseText)['response'];
                
                close_my_modal();
                alert(response);
                get_my_rents();
            }
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
                let response = JSON.parse(xhr.responseText)['exception'];
                alert(response);
            }
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 404) {
                let response = JSON.parse(xhr.responseText)['exception'];
                alert(response);
            }
        };
        xhr.send(jsonData);
        
    }
}













//Переход на админ страницу;
function open_admin_page(){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'admin_page', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            
            document.write(xhr.responseText);
            //console.log(xhr.responseText);
        }
    };
    xhr.send();
}


//При первом запуске страницы;
function start_page(){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Account/Me', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            
            get_acc_menu();
            
            let dv = document.getElementsByClassName('my_main_block')[0];
            let user_inf = JSON.parse(xhr.responseText);
            
            if(user_inf['account']['is_admin']){
                let special_btn = document.getElementsByClassName('special_btn')[0];
                special_btn.innerHTML = "Админ панель";
                special_btn.classList.toggle('spc_btn_act');
                special_btn.addEventListener('click', (event) => { //Клик на элемент;
                    open_admin_page();
                  });
            }

            let username = document.getElementById('username');
            let balance = document.getElementById('balance');
            
            username.innerHTML = `<p>${user_inf['account']['username']}</p>`;
            balance.innerHTML = `<p>${user_inf['account']['balance']} руб</p>`;
        }
    };
    xhr.send();

    window.trnsp_list_all = "";
}


//Первый запуск страницы;
window.onload = function() {
    start_page();
    main_block = document.getElementById('main_block');
};

/* 
//Формируем JSON для запроса
    let json_request = {'dischip':dics, 'about_group':about_group};
    let jsonData = JSON.stringify(json_request);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'group_list', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', ctoken);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            
            //console.log(xhr.responseText);

            let dv = document.getElementsByClassName('my_main_block')[0];
            dv.innerHTML = ""; //Удаляем все содержимое блока;
            dv.innerHTML = xhr.responseText; //Устанавливаем полученную страницу;

        }
    };
    xhr.send(jsonData);
*/