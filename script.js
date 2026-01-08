// ===== ОБЩИЕ ФУНКЦИИ ДЛЯ ВСЕХ СТРАНИЦ =====

// Все функции запускаются после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ ГОДА В ФУТЕРЕ
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // 2. АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ
    // Получаем текущую страницу
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Находим все ссылки в навигации
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Убираем active со всех ссылок и добавляем на нужную
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
        
        // Для главной страницы
        if (currentPage === 'index.html' && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });

    // 3. КНОПКА "НАВЕРХ"
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Показываем/скрываем кнопку при прокрутке
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) { // После 300px прокрутки
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Прокрутка наверх при клике
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. КНОПКИ "КОПИРОВАТЬ" ДЛЯ НОМЕРОВ ТЕЛЕФОНОВ
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            
            if (!number) return; // Если кнопка отключена
            
            // Копируем номер в буфер обмена
            navigator.clipboard.writeText(number).then(() => {
                // Сохраняем исходный текст кнопки
                const originalText = this.textContent;
                
                // Меняем текст на "Скопировано!"
                this.textContent = 'Скопировано!';
                this.style.backgroundColor = '#10B981';
                
                // Возвращаем исходный текст через 2 секунды
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
            }).catch(err => {
                // Если не сработало - показываем альтернативный способ
                const tempInput = document.createElement('input');
                tempInput.value = number;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                // Все равно меняем текст кнопки
                const originalText = this.textContent;
                this.textContent = 'Скопировано!';
                this.style.backgroundColor = '#10B981';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
            });
        });
    });
});

// ===== КОД ДЛЯ СТРАНИЦЫ "БАЗА ЗНАНИЙ" =====

// Проверяем, находимся ли на странице base.html
if (window.location.pathname.includes('base.html') || 
    document.body.classList.contains('page-base')) {
    
    // 1. ФИЛЬТРАЦИЯ СТАТЕЙ ПО ТЕГАМ
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articles = document.querySelectorAll('.article-card');
    
    if (filterButtons.length > 0 && articles.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс нажатой кнопке
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Фильтрация статей
                articles.forEach(article => {
                    const tags = article.getAttribute('data-tags');
                    
                    if (filterValue === 'all' || tags.includes(filterValue)) {
                        article.style.display = 'block';
                        // Плавное появление
                        setTimeout(() => {
                            article.style.opacity = '1';
                            article.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        article.style.opacity = '0';
                        article.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            article.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // 2. РАСКРЫТИЕ/СКРЫТИЕ ПОЛНОГО ТЕКСТА СТАТЬИ
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Находим полный текст статьи (следующий элемент после кнопки)
            const articleFull = this.nextElementSibling;
            
            if (articleFull && articleFull.classList.contains('article-full')) {
                // Закрываем другие открытые статьи
                document.querySelectorAll('.article-full.active').forEach(item => {
                    if (item !== articleFull) {
                        item.classList.remove('active');
                        const prevBtn = item.previousElementSibling;
                        if (prevBtn && prevBtn.classList.contains('read-more-btn')) {
                            prevBtn.textContent = 'Читать полностью';
                            prevBtn.classList.remove('active');
                        }
                    }
                });
                
                // Открываем/закрываем текущую статью
                articleFull.classList.toggle('active');
                
                // Меняем текст кнопки и стрелку
                if (articleFull.classList.contains('active')) {
                    this.textContent = 'Свернуть';
                    this.classList.add('active');
                } else {
                    this.textContent = 'Читать полностью';
                    this.classList.remove('active');
                }
            }
        });
    });

    // 3. АВТОМАТИЧЕСКОЕ РАСКРЫТИЕ СТАТЬИ ПРИ ПЕРЕХОДЕ ПО ССЫЛКЕ
    window.addEventListener('load', function() {
        // Получаем якорь из URL (например: #article-phone-blocked)
        const hash = window.location.hash;
        
        if (hash) {
            // Находим статью по ID
            const targetArticle = document.querySelector(hash);
            
            if (targetArticle && targetArticle.classList.contains('article-card')) {
                // Прокручиваем к статье
                targetArticle.scrollIntoView({ behavior: 'smooth' });
                
                // Находим кнопку "Читать полностью" у этой статьи
                const readMoreBtn = targetArticle.querySelector('.read-more-btn');
                const articleFull = targetArticle.querySelector('.article-full');
                
                // Раскрываем статью
                if (readMoreBtn && articleFull) {
                    // Закрываем другие открытые статьи
                    document.querySelectorAll('.article-full.active').forEach(item => {
                        item.classList.remove('active');
                        const prevBtn = item.previousElementSibling;
                        if (prevBtn && prevBtn.classList.contains('read-more-btn')) {
                            prevBtn.textContent = 'Читать полностью';
                            prevBtn.classList.remove('active');
                        }
                    });
                    
                    // Открываем нужную статью
                    articleFull.classList.add('active');
                    readMoreBtn.textContent = 'Свернуть';
                    readMoreBtn.classList.add('active');
                    
                    // Добавляем подсветку
                    targetArticle.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.3)';
                    targetArticle.style.borderColor = 'var(--blue)';
                    
                    // Убираем подсветку через 5 секунд
                    setTimeout(() => {
                        targetArticle.style.boxShadow = '';
                        targetArticle.style.borderColor = '';
                    }, 5000);
                }
            }
        }
    });
}