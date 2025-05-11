    // 'const' é usado para variáveis que não serão reatribuídas após a inicialização.
    // 'btnDarkMode' armazena a referência ao elemento HTML do botão com o ID 'btn-dark-mode'.
    const btnDarkMode = document.getElementById('btn-dark-mode');

    // 'themeSystem' obtém o valor da chave 'themeSystem' do 'localStorage'.
    // Se não existir nenhum valor para essa chave, o valor padrão 'light' é atribuído.
    const themeSystem = localStorage.getItem('themeSystem') || 'light';

    // Adiciona um 'event listener' ao botão para o evento de 'click'.
    // Quando o botão é clicado, a função dentro das chaves '{}' será executada.
    btnDarkMode.addEventListener('click', () => {
        // Obtém o tema atual do 'localStorage' (ou usa 'light' como padrão).
        let oldTheme = localStorage.getItem('themeSystem') || 'light';

        // Determina o novo tema. Se o tema antigo for 'light', o novo será 'dark', e vice-versa.
        let newTheme = oldTheme === "light" ? "dark" : "light";

        // Salva o novo tema no 'localStorage' com a chave 'themeSystem'.
        localStorage.setItem('themeSystem', newTheme);

        // Chama a função 'defineCurrentTheme' para aplicar o novo tema visualmente.
        defineCurrentTheme(newTheme);
    });

    // Função que recebe um 'theme' como argumento e aplica esse tema à página.
    function defineCurrentTheme(theme) {
        // Define os nomes dos ícones do Google Material Symbols Rounded para cada tema.

        // Ícone de sol para o modo escuro
        const darkIcon = '<span class="material-symbols-rounded">light_mode</span>';

        // Ícone de lua para o modo claro
        const lightIcon = '<span class="material-symbols-rounded">dark_mode</span>';

        // Define o atributo 'data-theme' no elemento 'html' com o valor do tema atual.
        // Isso permite que as regras CSS com '[data-theme="..."]' sejam aplicadas.
        document.documentElement.setAttribute("data-theme", theme);

        // Verifica se o tema atual é 'light'.
        if (theme === "light") {
            // Se for 'light', define o conteúdo interno do botão com o ícone de sol.
            btnDarkMode.innerHTML = darkIcon;
            return; // Sai da função após definir o ícone.
        }

        // Se o tema não for 'light' (implica que é 'dark' neste caso),
        // define o conteúdo interno do botão com o ícone de lua.
        btnDarkMode.innerHTML = lightIcon;
    }

    // Chama a função 'defineCurrentTheme' inicialmente com o tema obtido do 'localStorage'
    // (ou 'light' se nenhum tema estiver salvo). Isso garante que o tema correto seja aplicado
    // quando a página carrega.
    defineCurrentTheme(themeSystem);
