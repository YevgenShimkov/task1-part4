async function DataTable(config, data = null) {

    if (data === null) {
        data = await getData(config.apiUrl);
        data = Object.values(data.data);
    }

    let tablePlace = document.getElementById('usersTable'),
        table = document.createElement('table'),
        nav_wrapper = document.createElement('div'),
        searchField = addSearch(),
        addAddButton = addAddBtn(data, config.apiUrl, config),
        tableHead = createTableHead(config),
        tableBody = createTableBody(config, data);

    nav_wrapper.classList.add('nav_wrapper');
    addAddButton.classList.add('add_btn');

    //  table.insertAdjacentElement("beforeend", addAddBtn);


    table.insertAdjacentElement('beforeend', tableHead);
    table.insertAdjacentElement('beforeend', tableBody);
    tablePlace.insertAdjacentElement('beforebegin', nav_wrapper);
    nav_wrapper.insertAdjacentElement('beforeend', searchField);
    nav_wrapper.insertAdjacentElement('beforeend', addAddButton);
    tablePlace.appendChild(table);
}

const config1 = {
    parent: '#usersTable',
    columns: [
        { title: 'Имя', field: 'name' },
        { title: 'Фамилия', field: 'surname' },
        { title: 'Возраст', field: 'age' },
    ]
};

const configAPI = {
    parent: '#APITable',
    columns: [
        { title: 'Имя', field: 'name' },
        { title: 'Фамилия', field: 'surname' },
        { title: 'Аватар', field: 'avatar' },
        { title: 'День рождения', field: 'birthday' },
    ],
    apiUrl: 'http://mock-api.shpp.me/eshimkov/users'
};

const users = [
    { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
    { id: 30051, name: 'Вася', surname: 'Васечкин', age: 15 },
];


//DataTable(config1,users);
DataTable(configAPI);


/**
 *  draw the columns. We take the quantity from the parameter. We take only the title. 
 * @param {*} config 
 */
function createTableHead(config) {
    let thead = document.createElement('thead'),
        tr_tHead = document.createElement('tr');
    thead.style.backgroundColor = 'rgb(235, 235, 231)';

    thead.appendChild(tr_tHead);
    tr_tHead.insertAdjacentElement('beforeend', addingCell('head', '№'));

    config.columns.map(c => {
        tr_tHead.insertAdjacentElement('beforeend', addingCell('head', c.title));
    })
    tr_tHead.insertAdjacentElement('beforeend', addingCell('head', 'Действия'));
    return thead;
}

/**
 * draw the body table.
 * from the date we take the number of lines and their content
 */
function createTableBody(config, data) {
    let tbody = document.createElement('tbody'),
        max_id,
        index = 0;
    tbody.classList.add('table_body');
    data.map(d => {
        let tr_tBody = document.createElement('tr');

        tbody.appendChild(tr_tBody);
        tr_tBody.insertAdjacentElement('beforeend', addingCell('body', ++index));
        config.columns.map(c => {
            tr_tBody.insertAdjacentElement('beforeend', addingCell('body', d[c.field]));
        })

        if(d.id !== undefined) {
            tr_tBody.insertAdjacentElement('beforeend', addingButton(d.id, config.apiUrl));
            max_id = d.id;
        } else {
            tr_tBody.insertAdjacentElement('beforeend', addingButton(        max_id+1, config.apiUrl));
            max_id = max_id+1;
        }      
    })
    return tbody;
}

function addingButton(data, url) {
    let td_tBody = document.createElement('td');
    let td_tBodyButton = document.createElement('button');
    td_tBodyButton.classList.add('btn');
    td_tBodyButton.textContent = 'DELETE';
    td_tBody.insertAdjacentElement('beforeend', td_tBodyButton);
    td_tBodyButton.addEventListener('click', () => deleteRow(data, url));
    return td_tBody;
}

/**
 * Add a cell. We accept at the entrance where to insert and what text 
 * @param {*} place body or head
 * @param {*} text  cell text 
 * @returns  table element 
 */
function addingCell(place, text) {
    if (place === 'head') {
        let th_tHead = document.createElement('th');
        th_tHead.textContent = text;
        return th_tHead;
    } else {
        let td_tBody = document.createElement('td');
        td_tBody.textContent = text;
        return td_tBody;
    }
}

/**
 * create async function GET
 * parse data
 */
async function getData(url) {
    try {
        const response = await fetch(url)
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
    }

}

/**
 * delete row witch button was click
 * @param {*} data id row for delete
 * @param {*} url url api table
 * @returns 
 */
async function deleteRow(data, url) {
    console.log(data);
    let response = await fetch((url + '/' + data), {
        method: "DELETE",
    })
    if (response.ok) {
        window.location.reload();
    } else {
        console.log('you can`t delete this row');
    }
}

/**
 * add button to add new row
 */
function addAddBtn(data, url, config) {
    const addButton = document.createElement('button');
    addButton.classList.add('btn');
    addButton.textContent = 'ADD';
    addButton.addEventListener('click', () => createNewRow(data, config));
    return addButton;
}

/**
 * add field to seach
 */
function addSearch() {
    const searchField = document.createElement('input');
    searchField.classList.add('search_form');
    searchField.type = 'text';
    searchField.placeholder = 'Search';
    searchField.setAttribute('onkeyup', 'functionSearch()');
    return searchField;
}

/**
 * add function
 * we go through each line. then we go into each cell.
 *  And if there is an excerpt from the entered text tocycle on the line break
 *  and go to the next кщц. 
 */
function functionSearch() {
    let input, filter, table_body, row, j, i;

    input = document.querySelector('.search_form');
    filter = input.value.toLowerCase();
    table_body = document.querySelector('.table_body');
    row = table_body.getElementsByTagName('tr');
    for (i = 0; i < row.length; i++) {
        for (j = 0; j < row[i].cells.length; j++) {
            if (row[i].cells[j].innerHTML.toLowerCase().indexOf(filter) > -1) {
                row[i].style.display = '';
                break;
            } else {
                row[i].style.display = 'none';
            }
        }
    }
}

function createNewRow(data, config) {
    const tr_tBody = document.createElement('tr'),
        tbody = document.querySelector('.table_body'),
        td_tBody = document.createElement('td'); // first cell is empty
    tbody.insertAdjacentElement('afterbegin', tr_tBody);
    tr_tBody.insertAdjacentElement('beforeend', td_tBody);
    console.log(config);
    for (let i = 0; i < config.columns.length; i++) {
        let td_tBody = document.createElement('td'),
            row_input = document.createElement('input');
        row_input.classList.add('row_input');
        row_input.setAttribute('type', 'text');
        row_input.classList.add('row_input');
        row_input.classList.add('row_input');

        tr_tBody.insertAdjacentElement('beforeend', td_tBody);
        td_tBody.insertAdjacentElement('beforeend', row_input);
        row_input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                validateForm(config);
            }
        });
    }
}

/**
 * check what input in field
 * @param {} config config table
 */
function validateForm(config) {
    let allFields = [],
        inputFields = document.querySelectorAll('.row_input');
    for (value of inputFields) {
        if (value.value.length > 0) {
            allFields.push(value.value);
        }
    }
    if (allFields.length < config.columns.length) {
        console.log(allFields.length);
        alert('not all fields are filled ');
    } else {
        allFields = { name: allFields[0], surname: allFields[1], birthday: allFields[2], avatar: allFields[3] }
        sendNewRow(allFields, config.apiUrl);
    }
}

/**
 * 
 * @param {*} data  table
 * @param {*} url  url table
 */
async function sendNewRow(data, url) {
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    console.log(response.ok);
    if (response.status !== 200) {
        throw new Error("something went wrong, not added ");
    } else {
        window.location.reload();
    }
}







