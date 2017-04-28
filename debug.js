var background = window.chrome.extension.getBackgroundPage();
var conf = background.getConf();
var saveInputs = conf.ports;

document.getElementById('open').addEventListener('click', background.openDebugger);
document.getElementById('add').addEventListener('click', addInput);
document.getElementById('switch').addEventListener('change', background.changeRefresh);
document.getElementById('time').addEventListener('input', background.changeRefreshTime);

restore();



function restore() {
    document.getElementById('switch').checked = conf.auto;
    document.getElementById('time').value = conf.refresh;

    var addBtn = document.getElementById('add');

    saveInputs.forEach((saveInput) => {
        createInput(saveInput.id, saveInput.value, addBtn, true);
    });
}

function addInput() {
    var addBtn = document.getElementById('add');
    var inputs = document.getElementsByClassName('ports');
    var lastInput = inputs && inputs[inputs.length - 1];
    var lastInputNb = lastInput ? lastInput.id : '0';
    var id = (parseInt(lastInputNb, 10) + 1).toString();

    createInput(id, null, lastInput || addBtn, lastInput ? false : true);

    saveInputs.push({
        id    : id,
        value : 0
    });
}



function createInput(id, value, item, before) {
    var newInput = document.createElement('input');
    var newDelBtn = document.createElement('button');

    newInput.id = id;
    newInput.value = value;
    newInput.className = 'ports'
    newInput.oninput = (e) => {
        var input = e.target;
        var saveInput = saveInputs.find((save) => save.id === input.id);
        saveInput.value = input.value;
    };

    newDelBtn.innerHTML = 'X';
    newDelBtn.id = `btn-${id}`;
    newDelBtn.onclick = deleteInput;

    item.parentNode.insertBefore(newInput, before ? item : item.nextSibling.nextSibling);
    newInput.parentNode.insertBefore(newDelBtn, newInput.nextSibling);
}

function deleteInput(e) {
    var input = document.getElementById(e.target.id.substr(4, e.target.id.length));
    var btn = e.target;

    input.parentNode.removeChild(input);
    btn.parentNode.removeChild(btn);

    var x = saveInputs.find((save) => save.id === input.id);

    saveInputs.splice(saveInputs.indexOf(x), 1);
}
