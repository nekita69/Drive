//Переменные;

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
    parent.parentNode.toggle('activ_block_trnsp');

    let par = el.parentNode.classList.toggle('my_scale');
}

function hide_block2(el){
    let parent = el.parentNode.childNodes[3];
    parent.classList.toggle('acc_body_activ');
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

// ||||||||||||||||||||||| Пользователи |||||||||||||||||||||||
function adm_get_acc_menu(el){
    let sub_menu = document.getElementsByClassName('sub_menu')[0];
    let main_block = document.getElementsByClassName('main_block')[0];
    sub_menu.innerHTML = "";
    main_block.innerHTML = "";

    sub_menu.innerHTML= `
        <div class="sub_menu_for_chapter">
            <div class="sub_menu_for_chapter_item" onclick="adm_get_users_accs()">Пользователи</div>
            <div class="sub_menu_for_chapter_item" onclick="adm_add_user_acc()">Добавить</div>
        </div>
    `;
}

//Мой аккаунт;
function adm_acc_info(){
    adm_get_acc_menu();
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

//Выборка пользователей
function adm_get_users_accs(){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Account', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.setRequestHeader('start', 0);
    xhr.setRequestHeader('count', 30);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let users = JSON.parse(xhr.responseText)['users'];
            
            let temp = "";
            for(let i = 0; i < users.length; i++){
                user = users[i];

                temp += `
                    <div class="user_acc_item my_margin">
                            <div id="${user['user_id']}" class="user_acc_info">
                                <div class="acc_head" onclick="hide_block2(this)">
                                    <div class="acc_head_id">ID: ${user['user_id']}</div>
                                    <div class="acc_head_img"></div>
                                    <div class="acc_head_name">${user['username']}</div>
                                </div>
                                <div class="acc_body">
                                    <div class="acc_body_item">Username: ${user['username']}</div>
                                    <div class="acc_body_item">Balance: ${user['balance']}</div>
                                    <div class="acc_body_item">Admin: ${user['is_admin']}</div>
                                    <div class="acc_body_btns">
                                        <a class='btn_for_user_acc_info' onclick="send_get_his_users_rent(this)">История</a>
                                        <a class='btn_for_user_acc_info' onclick="send_get_users_rent(this)">Аренды</a>
                                        <a class='btn_for_user_acc_info' onclick="send_get_his_users_chenge(this)">Изменить</a>
                                        <a class='btn_for_user_acc_info' onclick="send_get_his_users_delete(this)">Удалить</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                `;
            }

            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = `
                <div class="my_form my_margin">
                    <div class="my_f_item my_margin"><h2>Пользователи</h2></div>
                    <div class="my_f_item my_margin"><input type="number" id='start' placeholder="Начало" min="0"></div>
                    <div class="my_f_item my_margin"><input type="number"  id='count' placeholder="Количество" min="1"></div>
                    <div class="my_f_item my_margin"><button class="my_button" onclick="adm_send_find_acc()">Найти</button></div>
                </div>
                <div class="get_user_acc_select my_margin">
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


//Выборка пользователей
function adm_send_find_acc(){
    let tokens = get_tokens();

    let start = document.getElementById('start').value;
    let count = document.getElementById('count').value;

    if(start == ''){
        start = 0;
    }
    if(count == ''){
        count = 30;
    }

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Account', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.setRequestHeader('start', start);
    xhr.setRequestHeader('count', count);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let users = JSON.parse(xhr.responseText)['users'];
            
            let temp = "";
            for(let i = 0; i < users.length; i++){
                user = users[i];

                temp += `
                    <div class="user_acc_item my_margin">
                            <div id="${user['user_id']}" class="user_acc_info">
                                <div class="acc_head" onclick="hide_block2(this)">
                                    <div class="acc_head_id">ID: ${user['user_id']}</div>
                                    <div class="acc_head_img"></div>
                                    <div class="acc_head_name">${user['username']}</div>
                                </div>
                                <div class="acc_body">
                                    <div class="acc_body_item">Username: ${user['username']}</div>
                                    <div class="acc_body_item">Balance: ${user['balance']}</div>
                                    <div class="acc_body_item">Admin: ${user['is_admin']}</div>
                                    <div class="acc_body_btns">
                                        <a class='btn_for_user_acc_info' onclick="send_get_his_users_rent(this)">История</a>
                                        <a class='btn_for_user_acc_info' onclick="send_get_users_rent(this)">Аренды</a>
                                        <a class='btn_for_user_acc_info' onclick="send_get_his_users_chenge(this)">Изменить</a>
                                        <a class='btn_for_user_acc_info' onclick="send_get_his_users_delete(this)">Удалить</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                `;
            }

            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = `
                <div class="my_form my_margin">
                    <div class="my_f_item my_margin"><h2>Пользователи</h2></div>
                    <div class="my_f_item my_margin"><input type="number" id='start' placeholder="Начало" min="0"></div>
                    <div class="my_f_item my_margin"><input type="number"  id='count' placeholder="Количество" min="1"></div>
                    <div class="my_f_item my_margin"><button class="my_button" onclick="adm_send_find_acc()">Найти</button></div>
                </div>
                <div class="get_user_acc_select my_margin">
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




//Добавить пользователя
function adm_add_user_acc(){    
    let main_block = document.getElementsByClassName('main_block')[0];
    main_block.innerHTML = `
        <div class="my_form my_flex my_margin">
        <div class="my_f_item my_margin"><h2>Добавить пользователя</h2></div>
            <div class="my_f_item my_margin"><input type="text" name="username" placeholder="Имя пользователя"></div>
            <div class="my_f_item my_margin">
                <div class="my_f_item_pass">
                    <input type="password" id="password" name="password" placeholder="Пароль"><input class="check_spec_pass" type="checkbox" name="checkbox_for_pass" onclick="checkPass1(this)">
                </div>
            </div>
            <div class="my_f_item my_margin"><input type="number" name="balance" placeholder="Баланс" min="0" value='0'></div>
            <div class="my_f_item my_margin"><div class='my_f_item_sub'>Администратор?<input type="checkbox" name="is_admin"></div></div>
            <div class="my_f_item my_margin"><button class="my_button" onclick="send_adm_add_user_acc()">Добавить</button></div>
        </div> 
    `;
}


//Отправка запроса на сервер с информацией о аккаунте;
function send_adm_add_user_acc(){
    tokens = get_tokens();

    let username = document.getElementsByName('username')[0].value;
    let password = document.getElementsByName('password')[0].value;
    let balance = document.getElementsByName('balance')[0].value;
    let is_admin = document.getElementsByName('is_admin')[0].checked;

    let sendData = {
    "token": tokens['token'],
    "username": username,
    "password": password,
    "is_admin": is_admin,
    "balance": balance
    };
    if(sendData['balance'] == ''){
        sendData['balance'] == 0;
    }
    let jsonData = JSON.stringify(sendData);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/Admin/AccountCreate', true);
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



// ||||||||||||||||||||||| Транспорт |||||||||||||||||||||||
function adm_get_trnsp_menu(el){    
    let sub_menu = document.getElementsByClassName('sub_menu')[0];
    let main_block = document.getElementsByClassName('main_block')[0];
    sub_menu.innerHTML = "";
    main_block.innerHTML = "";

    sub_menu.innerHTML= `
        <div class="sub_menu_for_chapter">
            <div class="sub_menu_for_chapter_item" onclick="adm_select_trnsp()">Транспорт</div>
            <div class="sub_menu_for_chapter_item" onclick="adm_add_trnsp()">Добавить ТС</div>
        </div>
    `;
}


//Выборка ТС;
function adm_select_trnsp(){
    tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Transport', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.setRequestHeader('start', 0);
    xhr.setRequestHeader('count', 20);
    xhr.setRequestHeader('transportType', 'all');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let transports = JSON.parse(xhr.responseText)['transports'];
            
            let temp = "";
            for(let i = 0; i < transports.length; i++){
                let trnsp = transports[i];

                let rent = 'Арендовано';
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
                        <div class="trnsp_list_info">
                            <div class="trnsp_head" onclick="hide_block(this)">
                                <div class="trnsp_head_mdl">
                                    <p>${trnsp['model']}</p>
                                    <p>${trnsp['dayPrice']} руб</p>
                                </div>
                                <div class="trnsp_head_img">
                                    <img src="static/driveapp/img/${img_p}" alt="${trnsp['transportType']}">
                                </div>
                                <div class="trnsp_head_foot for_rent">
                                    <p>Местоположение:</p>
                                    <p>${trnsp['latitude']}; ${trnsp['longitude']}</p>
                                </div>
                            </div>
                            <div class="trnsp_info">
                                <div class="trnsp_info_item"><p>ТС ID:</p><p>${trnsp['trnsp_id']}</p></div>
                                <div class="trnsp_info_item"><p>ID владельца:</p><p>${trnsp['owner_id']}</p></div>
                                <div class="trnsp_info_item"><p>Состояние:</p><p>${rent}</p></div>
                                <div class="trnsp_info_item"><p>Тип:</p><p>${trnsp['transportType']}</p></div>
                                <div class="trnsp_info_item"><p>Модель:</p><p>${trnsp['model']}</p></div>
                                <div class="trnsp_info_item"><p>Цвет:</p><p>${trnsp['color']}</p></div>
                                <div class="trnsp_info_item"><p>Номер:</p><p>${trnsp['identifier']}</p></div>
                                <div class="trnsp_info_item"><p>Описание:</p><p>${trnsp['description']}</p></div>
                                <div class="trnsp_info_item"><p>Местоположение:</p><p>${trnsp['position']}</p></div>
                                <div class="trnsp_info_item"><p>Г. шир:</p><p>${trnsp['latitude']}</p></div>
                                <div class="trnsp_info_item"><p>Г. долг:</p><p>${trnsp['longitude']}</p></div>
                                <div class="trnsp_info_item"><p>Цена за минуту:</p><p>${trnsp['minutePrice']}</p></div>
                                <div class="trnsp_info_item"><p>Цена за день:</p><p>${trnsp['dayPrice']}</p></div>
                            </div>
                            <div class="trnsp_foother">
                                <div><button class="btn_f_tr" onclick="send_adm_change_trnsp(this)">Изменить</button></div>
                                <div><button class="btn_f_tr" onclick="send_adm_delete_trnsp(this)">Удалить</button></div>
                                <div><button class="btn_f_tr" onclick="send_adm_get_his_trnsp(this)">История</button></div>
                            </div>
                        </div>
                    </div>
                `;
            }

            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";
            main_block.innerHTML = `
                <div class="my_form my_margin">
                    <div class="my_f_item my_margin"><h2>Транспорт</h2></div>
                    <div class="my_f_item my_margin"><input id='start' type="number" placeholder='Начало' min="0"></div>
                    <div class="my_f_item my_margin"><input id='count' type="number" placeholder='Количество' min="0"></div>
                    <div class="my_f_item my_margin">
                        <select id='transportType'>
                            <option value="car">Автомобиль</option>
                            <option value="bike">Мотоцикл</option>
                            <option value="schooter">Самокат</option>
                            <option value="all">Весь</option>
                        </select>
                    </div>
                    <div class="my_f_item my_margin">
                        <button class="my_button" onclick="send_adm_select_trnsp()">Найти</button>
                    </div>
                </div>

                <div class="trnsp_list my_margin">
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


//Получение выборки ТС;
function send_adm_select_trnsp(){
    tokens = get_tokens();

    let start = document.getElementById('start').value;
    let count = document.getElementById('count').value;
    let type = document.getElementById('transportType').value;

    if(start == ''){
        start = 0;
    }
    if(count == ''){
        count = 10;
    }

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Transport', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.setRequestHeader('start', start);
    xhr.setRequestHeader('count', count);
    xhr.setRequestHeader('transportType', type);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let transports = JSON.parse(xhr.responseText)['transports'];
            
            let temp = "";
            for(let i = 0; i < transports.length; i++){
                let trnsp = transports[i];

                let rent = 'Арендовано';
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
                        <div class="trnsp_list_info">
                            <div class="trnsp_head" onclick="hide_block(this)">
                                <div class="trnsp_head_mdl">
                                    <p>${trnsp['model']}</p>
                                    <p>${trnsp['dayPrice']} руб</p>
                                </div>
                                <div class="trnsp_head_img">
                                    <img src="static/driveapp/img/${img_p}" alt="${trnsp['transportType']}">
                                </div>
                                <div class="trnsp_head_foot for_rent">
                                    <p>Местоположение:</p>
                                    <p>${trnsp['latitude']}; ${trnsp['longitude']}</p>
                                </div>
                            </div>
                            <div class="trnsp_info">
                                <div class="trnsp_info_item"><p>ТС ID:</p><p>${trnsp['trnsp_id']}</p></div>
                                <div class="trnsp_info_item"><p>ID владельца:</p><p>${trnsp['owner_id']}</p></div>
                                <div class="trnsp_info_item"><p>Состояние:</p><p>${rent}</p></div>
                                <div class="trnsp_info_item"><p>Тип:</p><p>${trnsp['transportType']}</p></div>
                                <div class="trnsp_info_item"><p>Модель:</p><p>${trnsp['model']}</p></div>
                                <div class="trnsp_info_item"><p>Цвет:</p><p>${trnsp['color']}</p></div>
                                <div class="trnsp_info_item"><p>Номер:</p><p>${trnsp['identifier']}</p></div>
                                <div class="trnsp_info_item"><p>Описание:</p><p>${trnsp['description']}</p></div>
                                <div class="trnsp_info_item"><p>Местоположение:</p><p>${trnsp['position']}</p></div>
                                <div class="trnsp_info_item"><p>Г. шир:</p><p>${trnsp['latitude']}</p></div>
                                <div class="trnsp_info_item"><p>Г. долг:</p><p>${trnsp['longitude']}</p></div>
                                <div class="trnsp_info_item"><p>Цена за минуту:</p><p>${trnsp['minutePrice']}</p></div>
                                <div class="trnsp_info_item"><p>Цена за день:</p><p>${trnsp['dayPrice']}</p></div>
                            </div>
                            <div class="trnsp_foother">
                                <div><button class="btn_f_tr" onclick="send_adm_change_trnsp(this)">Изменить</button></div>
                                <div><button class="btn_f_tr" onclick="send_adm_delete_trnsp(this)">Удалить</button></div>
                                <div><button class="btn_f_tr" onclick="send_adm_get_his_trnsp(this)">История</button></div>
                            </div>
                        </div>
                    </div>
                `;
            }

            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";
            main_block.innerHTML = `
                <div class="my_form my_margin">
                    <div class="my_f_item my_margin"><h2>Транспорт</h2></div>
                    <div class="my_f_item my_margin"><input id='start' type="number" placeholder='Начало' min="0"></div>
                    <div class="my_f_item my_margin"><input id='count' type="number" placeholder='Количество' min="0"></div>
                    <div class="my_f_item my_margin">
                        <select id='transportType'>
                            <option value="car">Автомобиль</option>
                            <option value="bike">Мотоцикл</option>
                            <option value="schooter">Самокат</option>
                            <option value="all">Весь</option>
                        </select>
                    </div>
                    <div class="my_f_item my_margin">
                        <button class="my_button" onclick="send_adm_select_trnsp()">Найти</button>
                    </div>
                </div>

                <div class="trnsp_list my_margin">
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



//Создать ТС;
function adm_add_trnsp(){
    let tokens = get_tokens();
    let xhr1 = new XMLHttpRequest();
    xhr1.open('GET', 'api/Rent/Points', true);
    xhr1.setRequestHeader('Content-Type', 'application/json');
    xhr1.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr1.setRequestHeader('token', tokens['token']);
    xhr1.onreadystatechange = function() {
        if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
            let points = JSON.parse(xhr1.responseText)['rent_points'];
            
            temp2 = '';
            for(let j = 0; j < points.length; j++){
                temp2 += `<option value="${points[j]['lat']}; ${points[j]['long']}">${points[j]['name']}</option>`;
            }

            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";
            main_block.innerHTML = `
                <div class="my_form my_margin">
                <div class="my_f_item my_margin"><h2>Добавить ТС</h2></div>
                    <div class="my_f_item my_margin"><input id="owner_id" type="number" placeholder="Владелец" min=0></div>
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
                        <h3>Местоположение</h3>
                        <select id='position' class="my_margin">
                            ${temp2}
                        </select>
                    </div>
                    <div class="my_f_item my_margin"><input id="minutePrice" type="number" placeholder="Цена за минуту"></div>
                    <div class="my_f_item my_margin"><input id="dayPrice" type="number" placeholder="Цена за день"></div>

                    <div class="my_f_item my_margin"><div class='my_f_item_sub'>Доступно для аренды?<input id="canBeRented" type="checkbox"></div></div>
                    <div class="my_f_item my_margin"><textarea id="description" placeholder="Описание"></textarea></div>
                    <div class="my_f_item my_margin"><button class="my_button" onclick="send_adm_add_trnsp()">Добавить</button></div>
                </div>
            `;
        }
        
    };
    xhr1.send();
}


//Добавление ТС пользователю с ID;
function send_adm_add_trnsp(){
    let tokens = get_tokens();

    let owner_id = document.getElementById('owner_id').value;
    let canBeRented = document.getElementById('canBeRented').checked;
    let transportType = document.getElementById('transportType').value;
    let model = document.getElementById('model').value;
    let color = document.getElementById('color').value;
    let identifier = document.getElementById('identifier').value;

    let description = document.getElementById('description').value;
    let minutePrice = document.getElementById('minutePrice').value;
    let dayPrice = document.getElementById('dayPrice').value;

    let position = document.getElementById('position').value;
    let cord = position.split('; ');
    let lat = cord[0], long = cord[1];

    if(minutePrice == ""){
        latitude = Number(0);
    }
    if(dayPrice == ""){
        latitude = Number(0);
    }
    if(owner_id == ""){
        alert('Установите ID пользователя');
    }

    let sendData = {
            "token": tokens['token'],
            "owner_id": owner_id,
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
    xhr.open('POST', 'api/Admin/TransportCreate', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            alert(res['response']);
            send_adm_select_trnsp();
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){ //Если ошибка;
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send(jsonData);
}







// ||||||||||||||||||||||| Аренда |||||||||||||||||||||||
function adm_get_rent_menu(el){
    let sub_menu = document.getElementsByClassName('sub_menu')[0];
    let main_block = document.getElementsByClassName('main_block')[0];
    sub_menu.innerHTML = "";
    main_block.innerHTML = "";

    sub_menu.innerHTML= `
        <div class="sub_menu_for_chapter">
            <div class="sub_menu_for_chapter_item" onclick="create_rent_adm()">Аренда</div>
        </div>
    `;    
}


//Создать аренду
function create_rent_adm(){
    let tokens = get_tokens();
    let xhr1 = new XMLHttpRequest();
    xhr1.open('GET', 'api/Rent/Points', true);
    xhr1.setRequestHeader('Content-Type', 'application/json');
    xhr1.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr1.setRequestHeader('token', tokens['token']);
    xhr1.onreadystatechange = function() {
        if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
            let points = JSON.parse(xhr1.responseText)['rent_points'];
            
            temp2 = '';
            for(let j = 0; j < points.length; j++){
                temp2 += `<option value='${points[j]['name']}'>${points[j]['name']}</option>`;
            }

            let main_block = document.getElementsByClassName('main_block')[0];
            main_block.innerHTML = "";

            main_block.innerHTML = `
                <div class="my_form my_margin">
                <div class="my_f_item my_margin"><h2>Создать аренду</h2></div>
                    <div class="my_f_item my_margin"><input id='user_id' type="number" placeholder="ID пользователя"></div>
                    <div class="my_f_item my_margin"><input id='tr_id' type="number" placeholder="ID транспорта"></div>
                    <div class="my_f_item_for_select my_margin">
                        <h3>Местоположение</h3>
                        <select id='position' class="my_margin">
                            ${temp2}
                        </select>
                    </div>
                    <div class="my_f_item my_margin">
                        <input id='datetime' type='datetime-local' placeholder='Дата и время' required>
                    </div>
                    <div class="my_f_item my_margin">
                        <select id='rent_type'>
                            <option value="минуты">Минуты</option>
                            <option value="день">День</option>
                            <option value="5 дней">5 дней</option>
                            <option value="1 неделя">1 неделя</option>
                            <option value="2 недели">2 недели</option>
                        </select>
                    </div>
                    <div class="my_f_item my_margin"><textarea id="description" placeholder='Описание'></textarea></div>
                    <div class="my_f_item my_margin"><button class="my_button" onclick="send_create_rent_adm()" >Добавить</button></div>
                </div>
            `;
        }
        
    };
    xhr1.send();
}


//Отправка запроса на сервер с созданием аренды для пользователя с ID;
function send_create_rent_adm(){
    let tokens = get_tokens();

    let datetime = document.getElementById('datetime').value;
    if(datetime == ''){
        alert('Установите дату и время начала аренды');
    }
    else{
        let user_id = document.getElementById('user_id').value;
        let tr_id = document.getElementById('tr_id').value;
        let rent_type = document.getElementById('rent_type').value;
        let description = document.getElementById('description').value;
    
        let position = document.getElementById('position').value;
    
        let sendData = {
            "token": tokens['token'],
            "user_id": user_id,
            "tr_id": tr_id,
            "rent_type": rent_type,
            "rent_point_start":position,
            'rent_start':datetime,
            "description": description
        }
        let jsonData = JSON.stringify(sendData);
    
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'api/Admin/Rent', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 201) {
                let res = JSON.parse(xhr.responseText)['response'];
                adm_get_rent_menu();
                alert(res);
            }
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
                let res = JSON.parse(xhr.responseText)['exception'];
                alert(res);
            }
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 404) {
                let res = JSON.parse(xhr.responseText)['exception'];
                alert(res);
            }
        };
        xhr.send(jsonData);
    }
}





//Модальные окна;
/*
<div><button class="btn_f_tr" onclick="send_adm_change_trnsp(this)">Изменить</button></div>
<div><button class="btn_f_tr" onclick="send_adm_delete_trnsp(this)">Удалить</button></div>
<div><button class="btn_f_tr" onclick="send_adm_get_his_trnsp(this)">История</button></div>
*/

/* Закрытие модального окна */
function close_my_modal(){
    let modal = document.getElementsByClassName('my_modal')[0];
    modal.innerHTML = "";

    modal.classList.toggle('my_modal_unactive');

    let body = document.getElementsByTagName('body')[0];
    body.classList.toggle('body_scr_n'); //Включаем скролл у body;
}



//Модальное окно для изменения ТС;
function send_adm_change_trnsp(el){
    let tokens = get_tokens();
    let trnsp_id = el.parentNode.parentNode.parentNode.parentNode.id;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Transport/' + trnsp_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let transports = JSON.parse(xhr.responseText)['transports'];
            
            let tr_type = 'schooter';
            if(transports['transportType'] == 'мотоцикл'){
                tr_type = "bike";
            }
            else if(transports['transportType'] == 'автомобиль'){
                tr_type = "car";
            }
            else{
                tr_type = 'schooter';
            }


            let xhr1 = new XMLHttpRequest();
            xhr1.open('GET', 'api/Rent/Points', true);
            xhr1.setRequestHeader('Content-Type', 'application/json');
            xhr1.setRequestHeader('X-CSRFToken', tokens['ctoken']);
            xhr1.setRequestHeader('token', tokens['token']);
            xhr1.onreadystatechange = function() {
                if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
                    let points = JSON.parse(xhr1.responseText)['rent_points'];
                    
                    temp2 = '';
                    for(let j = 0; j < points.length; j++){
                        if(transports['latitude'] == points[j]['lat'] && transports['longitude'] == points[j]['long']){
                            temp2 += `<option value="${points[j]['lat']}; ${points[j]['long']}" selected>${points[j]['name']}</option>`;
                        }
                        else{
                            temp2 += `<option value="${points[j]['lat']}; ${points[j]['long']}">${points[j]['name']}</option>`;
                        }
                    }

                    let body = document.getElementsByTagName('body')[0];
                    body.classList.toggle('body_scr_n'); //Выключаем скролл у body;

                    let modal = document.getElementsByClassName('my_modal')[0];
                    modal.classList.toggle('my_modal_unactive'); //Включаем модальное окно;
                    modal.innerHTML = `
                        <div class="my_modal_close"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                        <div id="${transports['trnsp_id']}" class="my_form my_margin">
                            <div class="my_f_item my_margin"><h2>Изменить ТС c ID: ${transports['trnsp_id']}</h2></div>
                            <div class="my_f_item my_margin"><input id="owner_id" type="number" placeholder="Владелец" min=0 value="${transports['owner_id']}"></div>
                            <div class="my_f_item my_margin"><input id="model" type="text" placeholder="Модель" value="${transports['model']}"></div>
                            <div class="my_f_item my_margin">
                                <select id='transportType'>
                                    <option value="car" ${tr_type == 'car' ? 'selected' : ''}>Автомобиль</option>
                                    <option value="bike" ${tr_type == 'bike' ? 'selected' : ''}>Мотоцикл</option>
                                    <option value="schooter" ${tr_type == 'schooter' ? 'selected' : ''}>Самокат</option>
                                </select>
                            </div>
                            <div class="my_f_item my_margin"><input id="identifier" type="text" placeholder="Номер" value="${transports['identifier']}"></div>
                            <div class="my_f_item my_margin"><input id="color" type="text" placeholder="Цвет" value="${transports['color']}"></div>
                            <div class="my_f_item_for_select my_margin">
                                <h3>Местоположение</h3>
                                <select id='position' class="my_margin">
                                    ${temp2}
                                </select>
                            </div>
                            <div class="my_f_item my_margin"><input id="minutePrice" type="number" placeholder="Цена за минуту" value="${transports['minutePrice']}"></div>
                            <div class="my_f_item my_margin"><input id="dayPrice" type="number" placeholder="Цена за день" value="${transports['dayPrice']}"></div>

                            <div class="my_f_item my_margin"><div class='my_f_item_sub'>Доступно для аренды?<input id="canBeRented" type="checkbox" checked="${transports['canBeRented']}" ></div></div>
                            <div class="my_f_item my_margin"><textarea id="description" placeholder="Описание" value="${transports['description']}"></textarea></div>
                            <div class="my_f_item my_margin"><button class="my_button" onclick="send_server_change_trnsp(this)">Изменить</button></div>
                        </div>
                    `;

                    let desk = document.getElementById('description').value = transports['description'];

                }
                
            };
            xhr1.send();
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
            let res = JSON.parse(xhr.responseText)['exception'];
            alert(res);
        }
    };
    xhr.send();
}


//Отправка запроса на сервер, с данными для изменения ТС;
function send_server_change_trnsp(el){
    let trnsp_id = el.parentNode.parentNode.id;
    let tokens = get_tokens();

    let owner_id = document.getElementById('owner_id').value;
    let canBeRented = document.getElementById('canBeRented').checked;
    let transportType = document.getElementById('transportType').value;
    let model = document.getElementById('model').value;
    let color = document.getElementById('color').value;
    let identifier = document.getElementById('identifier').value;

    let description = document.getElementById('description').value;
    
    let minutePrice = document.getElementById('minutePrice').value;
    let dayPrice = document.getElementById('dayPrice').value;

    let position = document.getElementById('position').value;
    let cords = position.split('; ');
    let lat = cords[0], long = cords[1];

    if(minutePrice == ""){
        latitude = Number(0);
    }
    if(dayPrice == ""){
        latitude = Number(0);
    }
    if(owner_id == ""){
        alert('Установите ID пользователя');
    }

    if(transportType == 'car'){
        transportType = 'автомобиль'
    }
    else if(transportType == 'bike'){
        transportType = 'мотоцикл';
    }
    else{
        transportType = 'самокат';
    }

    let sendData = {
        "token": tokens['token'],
        "owner_id": owner_id,
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
    xhr.open('PUT', 'api/Admin/TransportUpdate/' + trnsp_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText)['response'];
            close_my_modal();
            alert(res);
            send_adm_select_trnsp();
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
            let res = JSON.parse(xhr.responseText)['exception'];
            alert(res);
        }
    };
    xhr.send(jsonData);

}






//Модальное окно для удаления ТС;
function send_adm_delete_trnsp(el){
    let trnsp_id = el.parentNode.parentNode.parentNode.parentNode.id;
    if(confirm("Удалить ТС c ID: " + trnsp_id + "?")){
        send_server_delete_trnsp(trnsp_id);
    }
}

//Запрос на удаление ТС;
function send_server_delete_trnsp(trnsp_id){
    tokens = get_tokens();

    sendData = {'token':tokens['token']};
    let jsonData = JSON.stringify(sendData);

    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'api/Admin/TransportDelete/' + trnsp_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText)['response'];
            alert(res);

            //Удалить элемент со страницы;
            let obj = document.getElementById(trnsp_id);
            let parent = obj.parentNode;
            parent.removeChild(obj);
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
            let res = JSON.parse(xhr.responseText)['exception'];
            alert(res);
        }
    };
    xhr.send(jsonData);
}


//Модальное окно для получения истории аренд ТС;
function send_adm_get_his_trnsp(el){
    let trnsp_id = el.parentNode.parentNode.parentNode.parentNode.id;

    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Rent/TransportHistory/' + trnsp_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText)['rent_info'];
            let rents = res;

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
                <div class="my_modal_close"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                <div class="my_modal_body my_margin">
                    <div class="container"> 
                        <div class="trnsp_list">
                            ${temp}
                        </div>
                    </div>
                </div>
            `;
            

        }
        else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}








//История аренд аккаунта - модальное окно;
function send_get_his_users_rent(el){
    let trnsp_id = el.parentNode.parentNode.parentNode.id;

    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Rent/UserHistory/' + trnsp_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let rents = res['rent_info'];

            let temp = ``;
            for(let i = 0; i < rents.length; i++){
                let rent = rents[i];

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
                <div class="my_modal_close"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                <div class="my_modal_body my_margin">
                    <div class="container"> 
                        <div class="trnsp_list my_overflow">
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

//Текущие аренды пользователя - модальное окно;
function send_get_users_rent(el){
    let user_id = el.parentNode.parentNode.parentNode.id;

    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Rent/Current/' + user_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.responseText);
            let rents = res['cur_rents'];

            if(rents.length > 0){
                let temp = ``;
                for(let i = 0; i < rents.length; i++){
                    let rent = rents[i];

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
                                    <div><button class="btn_f_tr" onclick="send_adm_end_rent(this)">Завершить</button></div>
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
                    <div class="my_modal_close"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                    <div class="my_modal_body my_margin">
                        <div class="container"> 
                            <div class="trnsp_list">
                                ${temp}
                            </div>
                        </div>
                    </div>
                `;
            }
            else{
                alert('У пользователя нет аренд');
            }            
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}


//Завершение аренды администратором - модальное окно;
function send_adm_end_rent(el){
    let rent_id = el.parentNode.parentNode.parentNode.parentNode.id;
    let tokens = get_tokens();
    let xhr1 = new XMLHttpRequest();
    xhr1.open('GET', 'api/Rent/Points', true);
    xhr1.setRequestHeader('Content-Type', 'application/json');
    xhr1.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr1.setRequestHeader('token', tokens['token']);
    xhr1.onreadystatechange = function() {
        if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
            let points = JSON.parse(xhr1.responseText)['rent_points'];
            
            let temp = '';
            for(let i = 0; i < points.length; i++){
                temp += `<option value='${points[i]['name']}'>${points[i]['name']}</option>`;
            }

            let modal = document.getElementsByClassName('my_modal')[0];
            modal.innerHTML = '';
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
                        <div class="my_f_item my_margin"><button class="my_button" onclick="send_adm_end_rent1(${rent_id})">Завершить</button></div>
                    </div>
                </div>
            `;
        }
    };
    xhr1.send();
    
}


//Завершение аренды администратором;
function send_adm_end_rent1(rent_id){
    if(confirm("Вы уверены, что хотите завершить аренду с ID" + rent_id + "?")){
        let tokens = get_tokens();
        let position = document.getElementById('position').value;
        let sendData = {
            "token":tokens['token'],
            "rent_point_finish":position
        };
        let jsonData = JSON.stringify(sendData);

        let xhr2 = new XMLHttpRequest();
        xhr2.open('POST', 'api/Admin/Rent/End/' + rent_id, true);
        xhr2.setRequestHeader('Content-Type', 'application/json');
        xhr2.setRequestHeader('X-CSRFToken', tokens['ctoken']);
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState === XMLHttpRequest.DONE && xhr2.status === 201) {
                let res = JSON.parse(xhr2.responseText)['response'];
                close_my_modal();
                alert(res);
            }
            if (xhr2.readyState === XMLHttpRequest.DONE && xhr2.status === 400){
                let res = JSON.parse(xhr2.responseText)['exception'];
                close_my_modal();
                alert(res);
            }
            if (xhr2.readyState === XMLHttpRequest.DONE && xhr2.status === 404){
                let res = JSON.parse(xhr2.responseText)['exception'];
                close_my_modal();
                alert(res);
            }
        };
        xhr2.send(jsonData);
    }
}





//Изменение аккаунта - модальное окно;
function send_get_his_users_chenge(el){
    let user_id = el.parentNode.parentNode.parentNode.id;

    let tokens = get_tokens();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Admin/Account/' + user_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let user = JSON.parse(xhr.responseText)['user'];

            let body = document.getElementsByTagName('body')[0];
            body.classList.toggle('body_scr_n'); //Выключаем скролл у body;

            let modal = document.getElementsByClassName('my_modal')[0];
            modal.classList.toggle('my_modal_unactive'); //Включаем модальное окно;
            modal.innerHTML = `
                <div class="my_modal_close"><button class="btn_f_tr" onclick="close_my_modal()">Закрыть</button></div>
                <div id="${user['user_id']}" class="my_form my_flex my_margin">
                    <div class="my_f_item my_margin"><h2>Изменить пользователя с ID: ${user['user_id']}</h2></div>
                    <div class="my_f_item my_margin"><input type="text" id="username_form" placeholder="Имя пользователя" value="${user['username']}"></div>
                    <div class="my_f_item my_margin">
                        <div class="my_f_item_pass">
                            <input type="password" id="password" placeholder="Пароль" value="${user['password']}"><input class="check_spec_pass" type="checkbox" name="checkbox_for_pass" onclick="checkPass1(this)">
                        </div>
                    </div>
                    <div class="my_f_item my_margin"><input type="number" id="balance_form" placeholder="Баланс" min="0" value="${user['balance']}"></div>
                    <div class="my_f_item my_margin"><div class='my_f_item_sub'>Администратор?<input type="checkbox" id="is_admin"></div></div>
                    <div class="my_f_item my_margin"><button class="my_button" onclick="send_data_for_server_change_acc(this)">Изменить</button></div>
                </div> 
            `;
                      
            let adm = document.getElementById('is_admin');
            adm.checked = user['is_admin'];
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send();
}

function send_data_for_server_change_acc(el){
    let user_id = el.parentNode.parentNode.id;

    let tokens = get_tokens();

    let username = document.getElementById('username_form').value;
    let password = document.getElementById('password').value;
    let is_admin = document.getElementById('is_admin').checked;
    let balance = document.getElementById('balance_form').value;

    let sendData = {
        "token": tokens['token'],
        "username": username,
        "password": password,
        "is_admin": is_admin,
        "balance": balance
    }
    let jsonData = JSON.stringify(sendData);

    let xhr = new XMLHttpRequest();
    xhr.open('PUT', 'api/Admin/AccountUpdate/' + user_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText)['response'];
            close_my_modal();
            alert(response);
            adm_get_users_accs();
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){
            let res = JSON.parse(xhr.responseText);
            alert(res['exception']);
        }
    };
    xhr.send(jsonData);
}


//Удаление аккаунта;
function send_get_his_users_delete(el){
    let user_id = el.parentNode.parentNode.parentNode.id;
    if(confirm('Удалить аккаунт с ID: ' + user_id + "?")){
        let tokens = get_tokens();

        let sendData = {'token':tokens['token']};
        let jsonData = JSON.stringify(sendData);

        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'api/Admin/AccountDelete/' + user_id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText)['response'];
                alert(response);
                adm_get_users_accs();
            }
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 404){
                let res = JSON.parse(xhr.responseText);
                alert(res['exception']);
            }
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400){
                let res = JSON.parse(xhr.responseText);
                alert(res['exception']);
            }
        };
        xhr.send(jsonData);
    }
}

















//Переход на обычную страницу приложения;
function open_index_main(){
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'index_back', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            
            //console.log(xhr.responseText);
            document.open();
            document.write(xhr.responseText);
            document.close();
        }
    };
    xhr.send();
}


//При первом запуске страницы;
function admin_start_page(){
    
    let tokens = get_tokens();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/Account/Me', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', tokens['ctoken']);
    xhr.setRequestHeader('token', tokens['token']);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        
            adm_get_acc_menu();

            let dv = document.getElementsByClassName('my_main_block')[0];
            let user_inf = JSON.parse(xhr.responseText);
             
            let special_btn = document.getElementsByClassName('special_btn')[0];
            special_btn.innerHTML = "Приложение";
            special_btn.classList.toggle('spc_btn_act');
            special_btn.addEventListener('click', (event) => { //Клик на элемент;
                open_index_main();
                });
            
            let username = document.getElementById('username');
            let balance = document.getElementById('balance');
            
            username.innerHTML = `<p>${user_inf['account']['username']}</p>`;
            balance.innerHTML = `<p>${user_inf['account']['balance']} руб</p>`;
        }
    };
    xhr.send();
}


//Первый запуск страницы; НЕ выполняется;
window.onload = function() {
    admin_start_page();
};
admin_start_page();