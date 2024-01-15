const monacoConfig = { paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }};
const themeRules = [
    { token: 'keyword', foreground: '4959b0' },
    { token: 'identifier', foreground: '8185a1' },
    { token: 'string', foreground: '4959b0' },
    { token: 'number', foreground: '4959b0' },
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { background: '#1b1a1d' },
];
const themeColors = {
    'editor.foreground': '#ffffff',
    'editor.background': '#1b1a1d', 
    'editorCursor.foreground': '#A7A7A7',
    'editor.lineHighlightBackground': '#2D2D30',
    'editorLineNumber.foreground': '#858585',
    'editor.selectionBackground': '#3A3D41',
    'editor.inactiveSelectionBackground': '#2b2d30',
};

let editors = {}, tabCount = 0, menu = document.querySelector('.menu'), currentEditorId = null, isFirstPrint = true;
const buttons = document.querySelectorAll('.icon-buttons button');
const executeButton = document.getElementById('execute');
const attachButton = document.getElementById('attach');
const clearButton = document.getElementById('clear');

const widgetModal = document.getElementById("wigetModal");
const widgetModalOpen = document.getElementById("widgetModalOpen");
const closeModal = document.getElementsByClassName("close");
const errorModal = document.querySelector('#errorModal');
const modalContent = document.querySelector('#widgetContent')
const errorContent = document.querySelector('#errorContent')
const errorTitle = document.querySelector('#errorTitle');
const errorMessage = document.querySelector('#errorMessage')

const errorText = document.querySelector('#error-value')
const scriptDiv = document.querySelector('.scripts-section');
const newFolder = document.querySelector('#new-folder');
const widgetForm = document.getElementById("widgetForm");
const placeholder = document.querySelector('#placeholder-scripts');
const viewers = document.querySelectorAll('.home, .script, .settings');
const autoInject = document.getElementById("checkbox1");
const welcomeHeaderText =  document.querySelector(".welcome-header div h1");
const welcomeHeaderPFP = document.querySelector(".welcome-header img");
const filesContainer = document.querySelector("#dirwrapper");
const consoleButtons = document.querySelectorAll('.console-button');
const consoleOutputs = document.querySelectorAll('.console-section > div');
const newsDiv = document.querySelector('.news-container');
const settingsDiv = document.getElementById('settings-container');

require.config(monacoConfig);
require(['vs/editor/editor.main'], function() {
    monaco.editor.defineTheme('vision', {
        base: 'vs-dark',
        inherit: true,
        rules: themeRules,
        language: 'lua',
        colors: themeColors
    });

    monaco.languages.registerCompletionItemProvider('lua', {
        triggerCharacters: [':' ],
        provideCompletionItems: function(model, position) {
            var textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
            var match = textUntilPosition.match(/\:\s*$/);
            if (!match) return { suggestions: [] };
    
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };
            var suggestions = [
                    {
                        label: ':GetDescendants',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns an array containing all descendants of the instance',
                        insertText: 'GetDescendants()',
                        range: range
                    },
                    {
                        label: ':FindFirstChild',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the first child of the Instance found with the given name.',
                        insertText: 'FindFirstChild()',
                        range: range
                    },
                    {
                        label: ':FindFirstAncestor',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the first ancestor of the Instance whose Name is equal to the given name.',
                        insertText: 'FindFirstAncestor()',
                        range: range
                    },
                    {
                        label: ':GetChildren',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns an array containing all of the Instance\'s children.',
                        insertText: 'GetChildren()',
                        range: range
                    },
                    {
                        label: ':GetFullName',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns a string describing the Instance\'s ancestry.',
                        insertText: 'GetFullName()',
                        range: range
                    },
                    {
                        label: ':GetPropertyChangedSignal',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns an event that fires when a given property of an object changes.',
                        insertText: 'GetPropertyChangedSignal()',
                        range: range
                    },
                    {
                        label: ':IsDescendantOf',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns true if an Instance is a descendant of the given ancestor.',
                        insertText: 'IsDescendantOf()',
                        range: range
                    },
                    {
                        label: ':SetPrimaryPartCFrame',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Sets the PrimaryPart of a Model to the given CFrame.',
                        insertText: 'SetPrimaryPartCFrame()',
                        range: range
                    },
                    {
                        label: ':WaitForChild',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the child of the Instance with the given name. If the child does not exist, it will yield the current thread until it does.',
                        insertText: 'WaitForChild()',
                        range: range
                    },
                    {
                        label: ':ClearAllChildren',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Removes all of an Instance\'s children.',
                        insertText: 'ClearAllChildren()',
                        range: range
                    },
                    {
                        label: ':FindFirstAncestorOfClass',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the first ancestor of the Instance whose ClassName is equal to the given className.',
                        insertText: 'FindFirstAncestorOfClass()',
                        range: range
                    },
                    {
                        label: ':FindFirstAncestorWhichIsA',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the first ancestor of the Instance for whom IsA returns true for the given className.',
                        insertText: 'FindFirstAncestorWhichIsA()',
                        range: range
                    },
                    {
                        label: ':FindFirstChildOfClass',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the first child of the Instance whose ClassName is equal to the given className.',
                        insertText: 'FindFirstChildOfClass()',
                        range: range
                    },
                    {
                        label: ':FindFirstChildWhichIsA',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the first child of the Instance for whom IsA returns true for the given className.',
                        insertText: 'FindFirstChildWhichIsA()',
                        range: range
                    },
                    {
                        label: ':GetAttribute',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the attribute which has been assigned to the given name.',
                        insertText: 'GetAttribute()',
                        range: range
                    },
                    {
                        label: ':GetAttributes',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns a dictionary of string → variant pairs for each of the Instance\'s attributes.',
                        insertText: 'GetAttributes()',
                        range: range
                    },
                    {
                        label: ':GetDebugId',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns an coded string of the Instance\'s DebugId used internally by Roblox.',
                        insertText: 'GetDebugId()',
                        range: range
                    },
                    {
                        label: ':GetPrimaryPartCFrame',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns a CFrame that describes the PrimaryPart’s position and orientation in world space.',
                        insertText: 'GetPrimaryPartCFrame()',
                        range: range
                    },
                    {
                        label: ':IsAncestorOf',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns true if an Instance is an ancestor of the given descendant.',
                        insertText: 'IsAncestorOf()',
                        range: range
                    },
                    {
                        label: ':IsA',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns true if an Instance\'s class matches or inherits from a given class.',
                        insertText: 'IsA()',
                        range: range
                    },
                    {
                        label: ':MoveTo',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Sets the object’s Position to the given Vector3.',
                        insertText: 'MoveTo()',
                        range: range
                    },
                    {
                        label: ':Remove',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'This function destroys all of an Instance\'s children.',
                        insertText: 'Remove()',
                        range: range
                    },
                    {
                        label: ':SetAttribute',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Sets the attribute with the given name to the given value.',
                        insertText: 'SetAttribute()',
                        range: range
                    },
                    {
                        label: ':TranslateBy',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Applies a Vector3 displacement to the Position of a Part.',
                        insertText: 'TranslateBy()',
                        range: range
                    },
                    {
                        label: ':GetMass',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns the mass of the Part in kilograms.',
                        insertText: 'GetMass()',
                        range: range
                    },
                    {
                        label: ':CanCollideWith',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns true if the part can collide with another part.',
                        insertText: 'CanCollideWith()',
                        range: range
                    },
                    {
                        label: ':GetConnectedParts',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns a table of the parts connected to this part.',
                        insertText: 'GetConnectedParts()',
                        range: range
                    },
                    {
                        label: ':GetJoints',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Returns a table of the joints connected to this part.',
                        insertText: 'GetJoints()',
                        range: range
                    },
                    {
                        label: ':BreakJoints',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Breaks all joints connected to this part.',
                        insertText: 'BreakJoints()',
                        range: range
                    },
                    {
                        label: ':MakeJoints',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Creates joints between this part and its touching parts.',
                        insertText: 'MakeJoints()',
                        range: range
                    },
                    {
                        label: ':SetNetworkOwner',
                        kind: monaco.languages.CompletionItemKind.Method,
                        documentation: 'Sets the network owner of a part, which is the player who has authority over the physical state of the part.',
                        insertText: 'SetNetworkOwner()',
                        range: range
                    },
                ]
            return { suggestions: suggestions };
        }
    });
    addTab();
    switchEditor('container1');
});

function createSwitchFunction(id) {
    return function() { switchEditor(id); };
}

function addTab(filename) {
    tabCount++;
    let id = `container${tabCount}`;
    let tabId = `tab${id}`;

    let newTab = document.createElement('div');
    newTab.className = 'tab';
    newTab.id = tabId;

    let tabButton = document.createElement('button');
    tabButton.className = 'tab-button';
    tabButton.onclick = function() { 
        
        var id = "container" + newTab.id.replace('tabcontainer', '');

        switchEditor(id);
     };

    tabButton.textContent = filename || `Tab ${tabCount}`;

    if (tabCount > 1) {
        let closeBtn = document.createElement('button');
        closeBtn.textContent = 'x';
        closeBtn.className = 'close-tab';
        closeBtn.onclick = function() { 
            var id = "container" + newTab.id.replace('tabcontainer', '');
            var tabId = `tab${id}`;
            
            removeTab(tabId, id); 
        };
        newTab.appendChild(closeBtn);
    }

    newTab.appendChild(tabButton);
    document.getElementById('tabList').appendChild(newTab);

    let newContainer = document.createElement('div');
    newContainer.id = id;
    newContainer.className = 'editor';
    newContainer.style.display = 'none';
    document.getElementById('editor-section').appendChild(newContainer);

    let editor = monaco.editor.create(newContainer, {
        value: 'print("Hello, World!")',
        language: 'lua',
        theme: 'vision'
    });

    newTab.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        menu.style.display = 'block';
        menu.style.left = e.pageX + 'px'; 
        menu.style.top = e.pageY + 'px';
    });

    editors[id] = editor;
    switchEditor(id);
}

function switchEditor(id) {
    Object.keys(editors).forEach(editorId => {
        document.getElementById(editorId).style.display = 'none';
    });

    let tabs = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    let currentTab = document.querySelector(`#tab${id} .tab-button`);
    if (currentTab) {
        currentTab.classList.add('active');
    }

    let container = document.getElementById(id);
    container.style.display = 'block';
    editors[id].layout();
    currentEditorId = id;
}

function removeTab(tabId, containerId) {   
    let tab = document.getElementById(tabId);
    let tabButton = tab.querySelector('.tab-button');
    let tabName = tabButton.textContent;
    let isNumberedTab = /^Tab \d+$/.test(tabName);

    tab.parentNode.removeChild(tab);
    let container = document.getElementById(containerId);
    container.parentNode.removeChild(container);
    delete editors[containerId];

    if (isNumberedTab) {
        let numberedTabs = Array.from(document.querySelectorAll('.tab-button'))
            .filter(button => /^Tab \d+$/.test(button.textContent))
            .sort((a, b) => {
                let numA = parseInt(a.textContent.replace('Tab ', ''), 10);
                let numB = parseInt(b.textContent.replace('Tab ', ''), 10);
                return numA - numB;
            });

        numberedTabs.forEach((button, index) => {
            button.textContent = `Tab ${index + 1}`;
        });
    }

    if (Object.keys(editors).length > 0) {
        switchEditor(Object.keys(editors)[0]);
    }
}

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        viewers.forEach(viewer => viewer.style.display = 'none');
        buttons.forEach(button => button.style.backgroundColor = 'transparent');

        viewers[index].style.display = 'block';
        button.style.backgroundColor = '#161518';
        button.style.animation = 'bounce 0.6s';

        ['home-container', 'editor-container', 'settings-container', 'action-buttons'].forEach(id => {
            document.getElementById(id).style.display = 'none';

        });

        let containerId = ['home-container', 'editor-container', 'settings-container'][index];
        document.getElementById(containerId).style.display = 'block';

        if (index === 1) {
            Object.values(editors).forEach(editor => editor.layout());
            document.getElementById('action-buttons').style.display = 'flex';
        }
        createOverlap(button, index);
    });

    button.addEventListener('animationend', function() {
        button.style.animation = '';
    });
});


function createOverlap(button, index) {
    document.querySelectorAll('#temp-div').forEach(el => el.remove());

    let overlap = createDiv(button.offsetLeft + button.offsetWidth, button.getBoundingClientRect().top, '23px', '65px', '#161518', 'bounce 0.5s', '-3');
    let corner = createDiv(button.offsetLeft + button.offsetWidth - 15, button.getBoundingClientRect().top + 65, '30px', '30px', '#161518', 'bounce 0.5s', '-3', 'radial-gradient(circle 30px at bottom left, transparent 0, transparent 30px, black 21px)');
    document.body.appendChild(corner);
    document.body.appendChild(overlap);

    if (index != 0) {
        let corner2 = createDiv(button.offsetLeft + button.offsetWidth - 15, button.getBoundingClientRect().top - 30, '30px', '30px', '#161518', 'bounce 0.5s', '-3', 'radial-gradient(circle 30px at top left, transparent 0, transparent 30px, black 21px)');
        document.body.appendChild(corner2);

    }
}

function createDiv(left, top, width, height, backgroundColor, animation, zIndex, maskImage = null) {
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = left + 'px';
    div.id = 'temp-div';    
    div.style.top = top + 'px';
    div.style.width = width;
    div.style.height = height;
    div.style.backgroundColor = backgroundColor;
    div.style.animation = animation;
    div.style.zIndex = zIndex;
    if (maskImage) {
        div.style.WebkitMaskImage = maskImage;
    }
    return div;

}
document.addEventListener('click', function(e) {
    if (e.target !== menu && !menu.contains(e.target)) {
        menu.style.display = 'none';
    }
});

function saveTabs() {
    let tosave = {};
    
    Object.keys(editors).forEach(editorId => {
        let editor = editors[editorId];
        tosave[
            editor._id
        ] = editor.getValue();
    });

    pywebview.api.saveTabs(tosave);
};

function handleButtonClick(event) {
    const button = event.target.closest('button');
    
    if (button) {
        const buttonId = button.id;
        const tabId = `tabcontainer${tabCount}`;
        const containerId = `container${tabCount}`;
        const allTabs = document.querySelectorAll('.tab');
        console.log(buttonId, event);

        switch (buttonId) {
            case 'close-button':
                removeTab(tabId, containerId);
                break;
            case 'rename-button':
                let newName = prompt('Enter new name for the tab:');
                if (newName) {
                    let tabButton = document.querySelector(`#${tabId} .tab-button`);
                    if (tabButton) {
                        tabButton.textContent = newName;
                    }
                }
                break;
            case 'duplicate-button':
                let editor = editors[currentEditorId];
                let content = editor.getValue();
                addTab();
                let newEditorId = `container${tabCount}`;
                let newEditor = editors[newEditorId];
                newEditor.setValue(content);
                switchEditor(newEditorId);
                break;
            case 'save-button':
                let currentEditor = editors[currentEditorId];
                pywebview.api.saveFile(currentEditor.getValue());
                break;
            case 'saveall-button':
                saveTabs();
                break;
            case 'pin-button':
                break;
            case 'closeall-button':
                allTabs.forEach((tab, index) => {
                    if (index > 0) {
                        const editorId = tab.id.replace('tabcontainer', 'container');
                        removeTab(tab.id, editorId);
                        tabCount--;
                    }
                });
                break;
            case 'closeright-button':
                let currentIndex = Array.from(allTabs).indexOf(document.getElementById(tabId));
                allTabs.forEach((tab, index) => {
                    console.log(index, currentIndex)
                    if (index > currentIndex) {
                        let editorId = tab.id.replace('tabcontainer', 'container');
                        removeTab(tab.id, editorId);
                        tabCount--;
                    }
                });
                break;
            default:
                clientError("Client Error", "Button not handled.");
        }
        menu.style.display = 'none';
    }
}

function loadWidgets() {
    if (window.pywebview && window.pywebview.api) {
        scriptDiv.innerHTML = '';
        window.pywebview.api.returnWidgetData().then(function(response) {
            if (response !== null) {
                var widgets = Array.isArray(response) ? response : Object.values(response);
                widgets.forEach(function(widget) {
                    var scriptItem = document.createElement('div');
                    scriptItem.className = 'script-item';
        
                    var scriptContent = document.createElement('div');
                    scriptContent.className = 'script-content';
                    var scriptTitle = document.createElement('h2');
                    scriptTitle.textContent = widget.title;
                    var scriptDescription = document.createElement('p');
                    scriptDescription.innerHTML = widget.description;
        
                    scriptContent.appendChild(scriptTitle);
                    scriptContent.appendChild(scriptDescription);
        
                    var scriptButtons = document.createElement('div');
                    scriptButtons.className = 'script-buttons';
                    var executeButton = document.createElement('button');
                    executeButton.className = 'script-button';
                    executeButton.textContent = 'Execute';
                    executeButton.addEventListener('click', function() {
                        pywebview.api.execute(widget.script);
                    });

                    var moreInfoButton = document.createElement('button');
                    moreInfoButton.className = 'script-button';
                    moreInfoButton.textContent = 'More Info';
        
                    scriptButtons.appendChild(executeButton);
                    scriptButtons.appendChild(moreInfoButton);
        
                    scriptItem.appendChild(scriptContent);
                    scriptItem.appendChild(scriptButtons);
        
                    scriptDiv.appendChild(scriptItem);
                });
                placeholder.style.display = "none";
            } else {
               placeholder.style.display = "block";
            }
        });
    }
}

function printToConsole(message, messageType = 'normal') {
    const consoleOutput = document.querySelector('.console-output');
    const messageElement = document.createElement('div');
    const currentTime = new Date().toLocaleTimeString();

    switch (messageType) {
        case 'error':
            messageElement.style.color = '#f54248';
            break;
        case 'warning':
            messageElement.style.color = '#f0b54f';
            break;
        case 'info':
            messageElement.style.color = '#774ff0';
            break;
        default:
            messageElement.style.color = 'white';
    }

    messageElement.textContent = `${currentTime} - ${message}`;

    if (isFirstPrint) {
        consoleOutput.innerHTML = '';
        isFirstPrint = false;
    }

    consoleOutput.appendChild(messageElement);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

consoleButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        consoleOutputs.forEach(output => {
            output.style.display = 'none';
        });

        consoleButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = 'transparent';
        });

        consoleOutputs[index].style.display = 'block';
        button.classList.add('active');
        button.style.backgroundColor = '#1b1a1d';
    });
});


function createDirectoryTree(container, items, level = 0) {
    items.forEach(function(item) {
        var wrapper = document.createElement('div');
        var button = document.createElement('button');
        button.style.marginLeft = level * 27 + 'px'; 
        button.style.display = '';
        button.style.position = 'relative'; 

        var resetButtonBackgrounds = function() {
            var buttons = document.querySelectorAll('.dirbutton');
            buttons.forEach(function(btn) {
                btn.style.background = 'transparent';
            });
        };

        var folderClosedSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9 5l6 7l-6 7"/></svg>';
        var folderOpenSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19 9l-7 6l-7-6"/></svg>';
        var fileSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828C4.343 2 6.239 2 10.03 2c.606 0 1.091 0 1.5.017c-.013.08-.02.161-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22" clip-rule="evenodd" opacity=".5"/><path fill="white" d="M8 14.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5s.448-1.5 1-1.5s1 .672 1 1.5m1.416 2.376a.75.75 0 0 0-.832 1.248a6.158 6.158 0 0 0 6.832 0a.75.75 0 1 0-.832-1.248a4.658 4.658 0 0 1-5.168 0M18 14.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5s.448-1.5 1-1.5s1 .672 1 1.5M11.51 2.26l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052c.013.155.022.321.028.5H22c0-.268 0-.402-.01-.56a5.322 5.322 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a5.488 5.488 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"/></svg>';
        var secondSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77c.079.07.154.145.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14z" opacity=".5"/><path fill="white" d="M20 6.238c0-.298-.005-.475-.025-.63a3 3 0 0 0-2.583-2.582C17.197 3 16.965 3 16.5 3H9.988c.116.104.247.234.462.45L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .849.352C14.098 6 14.675 6 15.829 6h.373c1.78 0 2.957 0 3.798.238"/><path fill="white" fill-rule="evenodd" d="M12.25 10a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75" clip-rule="evenodd"/></svg>'
        
        var iconSpan = document.createElement('span');
        iconSpan.innerHTML = item.type === 'folder' ? folderClosedSVG : fileSVG;
        button.appendChild(iconSpan);

        if (item.type === 'folder') {
            var secondIconSpan = document.createElement('span');
            secondIconSpan.innerHTML = secondSVG;
            secondIconSpan.style.marginLeft = '-5px';
            button.appendChild(secondIconSpan);
        }

        var textSpan = document.createElement('span');
        textSpan.textContent = item.name;
        textSpan.style.marginLeft = '2px';
        button.appendChild(textSpan);

        if (item.type === 'folder') {
            var childContainer = document.createElement('div');
            childContainer.style.display = 'none';

            button.addEventListener('click', function() {
                resetButtonBackgrounds();
                var isClosed = childContainer.style.display === 'none';
                childContainer.style.display = isClosed ? '' : 'none';
                button.style.background = 'linear-gradient(to bottom, #232327 25%, #19191b 100%)';
                iconSpan.innerHTML = isClosed ? folderOpenSVG : folderClosedSVG;
            });

            button.id = "folder";
            button.className = 'dirbutton'
            wrapper.appendChild(button);
            wrapper.appendChild(childContainer);
            createDirectoryTree(childContainer, item.children, level + 1);
        } else {
            button.addEventListener('click', function() {
                resetButtonBackgrounds();
                addTab(item.name);
                let editor = editors[`container${tabCount}`];
                editor.setValue(item.content);
                button.style.background = 'linear-gradient(to bottom, #232327 25%, #19191b 100%)';
            });

            button.id = "file";
            button.className = 'dirbutton'
            wrapper.appendChild(button);
        }

        container.appendChild(wrapper);
    });
}

function clientError(title, error) {
    errorModal.style.display = "block";
    const lines = error.split('\n');
    const formattedLines = lines.map(line => {
        return line.replace(/(-.*?:)\s+(.*)/, "<span class='white-text'>$1</span> <span class='grey-text'>$2</span>");
    });

    errorMessage.innerHTML = formattedLines.join('<br>');
    errorTitle.textContent = title;
    setTimeout(function() {
        errorModal.style.backdropFilter = 'blur(5px)';
        errorModal.style.backgroundColor = 'rgba(0,0,0,0.6)';
        errorContent.style.transform = 'translate(-50%, -50%) scale(1)';
        errorContent.style.opacity = '1';
    }, 50);

    closeModal[1].addEventListener('click', function() {
        errorModal.style.backdropFilter = 'blur(0px)';
        errorModal.style.backgroundColor = 'rgba(0,0,0,0)';
        errorContent.style.transform = 'translate(-50%, -50%) scale(0.9)';
        errorContent.style.opacity = '0';
        setTimeout(function() {
            errorModal.style.display = "none";
        }, 200);
    });
}

executeButton.addEventListener('click', function() {
    let currentEditor = editors[currentEditorId];
    pywebview.api.execute(currentEditor.getValue());
});

attachButton.addEventListener('click', function() {
    attachButton.style.border = '1px solid white';

    pywebview.api.attach().then(function(response) {
        console.log(response)
        if (response[0] === true) {
            attachButton.style.border = '1px solid green';
            printToConsole(response[1] || "Successfully attached.", 'info');
        } else {
            attachButton.style.border = '1px solid red';
            printToConsole(response[1] || "Unexpected error while attaching.", 'error');
        }
        
        setTimeout(function() {
            attachButton.style.border = '';
        }, 2000);
    }).catch(function(error) {
        attachButton.style.border = '1px solid red';
        console.error('Error during injection:', error);
        
        setTimeout(function() {
            attachButton.style.border = '';
        }, 2000);
    });
});
clearButton.addEventListener('click', function() {
    let currentEditor = editors[currentEditorId];
    currentEditor.setValue('');
});

widgetModalOpen.addEventListener('click', function() {
    widgetModal.style.display = "block";
    setTimeout(function() {
        widgetModal.style.backdropFilter = 'blur(5px)';
        widgetModal.style.backgroundColor = 'rgba(0,0,0,0.6)';
        modalContent.style.transform = 'translate(-50%, -50%) scale(1)';
        modalContent.style.opacity = '1';
    }, 50);
})

closeModal[0].addEventListener('click', function() {
    widgetModal.style.backdropFilter = 'blur(0px)';
    widgetModal.style.backgroundColor = 'rgba(0,0,0,0)';
    modalContent.style.transform = 'translate(-50%, -50%) scale(0.9)';
    modalContent.style.opacity = '0';
    setTimeout(function() {
        widgetModal.style.display = "none";
    }, 200);
})

widgetForm.onsubmit = function(event) {
    event.preventDefault();

    let title = document.getElementById('widgetTitle').value;
    let description = document.getElementById('widgetDescription').value;
    let script = document.getElementById('widgetScript').value;

    console.log(title, description, script)
    pywebview.api.createWidget(title, description, script);

    widgetModal.style.display = "none";

    setTimeout(loadWidgets, 100);
}

newFolder.addEventListener('click', function() {
    window.pywebview.api.openFiles().then(function(response) {
        var existingButtons = filesContainer.querySelectorAll('button:not([id]):not([class])');
        existingButtons.forEach(function(button) {
            button.remove();
        });

        var items = JSON.parse(response);
        createDirectoryTree(filesContainer, items);
    });
});


function closeWindow() {
    window.pywebview.api.closeWindow();
}

function minimize() {
    window.pywebview.api.minimizeWindow();
}

menu.addEventListener('click', handleButtonClick);
createOverlap(buttons[0], 0);
viewers[0].style.display = 'block';
buttons[0].style.backgroundColor = '#161518';
consoleButtons[0].style.backgroundColor = '#1b1a1d'
consoleOutputs[0].style.display = 'block';


async function updateNews() {
    var newHtml = '';

    var news = await fetch('https://raw.githubusercontent.com/RuneSoftworks/public-test/main/news.json').then(response => response.json());


    news.forEach(function(newsItem) {
        newHtml += `
            <div class="news-item">
            <div class="news-header">
                <img class="news-icon" src="../assets/icon.png">
                <p>News</p>
            </div>
            <p class="news-title">${newsItem.title}</p>
            <p class="news-description">${newsItem.description}</p>
        </div>
        `;
    });

    newsDiv.innerHTML = newHtml;
}

function handleSettingsChange(event) {
    pywebview.api.saveSetting(event.target.id, event.target.checked);
}

updateNews();

window.addEventListener('pywebviewready', (event) => {
    (async function () {
        const credentials = await pywebview.api.getCredentials();
        
        welcomeHeaderText.innerHTML = `Welcome back, ${credentials['username']}`;

        var getTabs = await pywebview.api.getTabs();
        
        if (Object.keys(getTabs).length > 0) {
            Object.keys(getTabs).forEach((tabId, index) => {
                addTab();
                let editor = editors[`container${tabCount}`];
                editor.setValue(getTabs[tabId]);
            });
        }

        if (Object.keys(editors).length === 0) {
            addTab();
            switchEditor('container1');
        };

        var settings = await pywebview.api.getSettings();
        Object.values(settingsDiv.children).forEach(child => {
            var input = child.querySelector('input');
        
            if ( input && settings[input.id] ) {
                input.checked = settings[input.id];
                
            }
            input.addEventListener('change', handleSettingsChange);
        });

        loadWidgets();
        clientError("PATCH NOTES: Whats new?", "- Enhanced Console: Improved the console with new sections for problems and debugging, making it easier to troubleshoot issues.\n\n- UI Improvements: Added minimize and close buttons for better window management, along with a custom error UI for clearer feedback on issues.\n\n- Widget Enhancements: Upgraded widget functionality with the ability to create, execute, and save directly within the widget.\n\n- Settings Tab Upgrades: Introduced new features in the settings tab including auto-inject and auto-execute options for streamlined workflows.\n\n- Auto Update Loader: Implemented an auto-update feature for the loader to ensure you're always working with the latest version.\n\n- Performance Boost: Fixed window dragging latency and added threading for attaching and executing processes, utilizing a thread pool for increased speed.\n\n- UI Directory Tree: Added UI elements and functionality for a directory tree, enabling users to open folders within the IDE effortlessly.\n\n- Persistent Settings and Tabs: Enhanced the IDE to save settings and tabs, allowing for a seamless development experience across sessions.\n\n- Bridge Fix: Resolved an issue where the bridge would break on strings containing symbols, ensuring more robust handling of data.\n\n- RC2 Loader Update: Released RC2 LOADER with improvements, now without TP and toolless for a cleaner experience.\n\n- Improved Authentication: Updated the login system to include a 'Remember Me' feature, making it more convenient to access your workspace.")
    })()
});

printToConsole("Vision authentication successful.", 'normal');
