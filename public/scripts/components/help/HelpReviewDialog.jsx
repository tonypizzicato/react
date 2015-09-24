const React  = require('react'),
      mui    = require('material-ui'),

      Dialog = mui.Dialog;

class HelpPhoto extends React.Component {

    show() {
        this.refs.dialog.show();
    }

    render() {
        const styles = this.getStyles();
        
        const actions = [
            {text: 'Ну, OK'}
        ];

        return (
            <Dialog contentStyle={styles.root} title="Оформление анонсов и обзоров" autoDetectWindowHeight={true} autoScrollBodyContent={true} actions={actions} ref="dialog">
                <p>
                    Для оформления обзора или анонса необходимо ввести текст в соотвествующее поле, а так же добавить ссылки на видео, если они есть.<br />
                    <strong>Важно.</strong> Для того чтобы обзор/анонс стали доступны на сайте необходимо включить переключатель "Показывать".
                </p>

                <p>
                    Анонс<br />
                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review1.png"/>
                    Обзор<br />
                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review2.png"/>
                </p>

                <p>
                    При работе с анонсами можно обозначить матч как центральный переключение соответсвующего элемента.
                    В этом случае необходимо загрузить фото встречающихся команд.
                    В результате на сайте появится блок центрального матча следующего тура.

                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review3.png"/>
                </p>

                <h3>Отображение анонса/обзора на сайте</h3>

                <p>
                    Для того чтобы сохранить обзор или анонс в системе и, соотвественно, отобразить на сайте небоходимо ввести текст обзора.
                    Если для обзора или анонса нет текста(как, например, в АПЛ), но есть видео,
                    в поле "Текст" можно вбить текст вроде "Видеоанонс матча" или "Видеообзор матча".<br />
                    Также необходимо не забыть включить переключатель "Показывать".
                </p>

                <h3>Форматирование текста</h3>

                <p>
                    Форматирование в административной панели работает одинаково для всех элементов контента(анонсы/обзоры/новости).
                    Для активации редактирования нужно выделить текст, который необходимо выделить особым образом, в результате появится панель форматирования.
                    Пиктограммы кнопок панели имеют общепринятые обозначения.

                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review8.png"/>
                </p>

                <h3>Добавление видео</h3>

                <p>
                    Для каждого анонса и обзора можно добавлять видео. Это могут быть любые ролики связанные с матчем.<br />
                    Предварительно видео должно быть загружено на один из видео хостингов - vk, youtube или vimeo.<br />
                    Для добавления видео нужно выбрать тип видео сервиса, на который загружено видео и сохранить embed ссылку на него.
                    Дополнительно можно добавить заголовок для этого видео(пока это поле не выводится, но может быть добавлено на сайт).<br />
                    Для того, чтобы добавить несколько видео, необходимо нажать на кнопку добавления дополнительного видео(иконка плюсика у последнего видео).

                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review9.png"/>
                </p>

                <h4>Где взять правильную ссылку</h4>

                <p>
                    <strong>Важно.</strong> В случае вставки неправильной ссылке на сайте могут появиться побочные эффекты.
                </p>

                <h5 className="s_mb_0">Youtube</h5>

                <p>
                    Для того чтобы вставить видео из yotube необходимо скопировать <strong>embed</strong> ссылку.
                    Например ссылка для видео <a href="https://www.youtube.com/watch?v=bmXumtgwtak" target="_blank">Eminem - Lose Yourself (Official Music
                    Video)</a>,
                    которая для браузера выглядит так: https://www.youtube.com/watch?v=bmXumtgwtak, <strong>для сохранения в системе</strong> будет
                    выглядеть так: <strong>https://www.youtube.com/embed/bmXumtgwtak</strong>.
                    Все ссылки для вставки из youtube должны выглядеть так, а отличаться только ID видео(в данном случае это bmXumtgwtak).
                    Чтобы получить эту ссыку можно на странице с видео скопировать её из специального элемента

                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review4.png"/>

                </p>
                <h5 className="s_mb_0">Vimeo</h5>

                <p>
                    Ссылка вытаскивается по аналогии.<br />
                    Для её получения необходимо нажать на кнопку Share(иконка самолетика)
                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review5.png"/>
                    И скопировать <strong>только ссылку</strong>.
                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review6.png"/>
                    Поскольку vimeo дает выдделить только весь текст и не дает выделить только ссылку,
                    копируем что можем и оставляем <strong>только ссылку</strong>.
                </p>

                <p>
                    В итоге для видео <a href="https://vimeo.com/43687644" target="_blank">The Black Eyed Peas - Let's Get It Started</a>,
                    которая для браузера выглядит так: https://vimeo.com/43687644, <strong>для сохранения в системе</strong> будет
                    выглядеть так: <strong>https://player.vimeo.com/video/43687644</strong>.
                    Опять же, все ссылки для вставки из vimeo должны выглядеть так, а отличаться только ID видео(в данном случае это 43687644).
                </p>

                <h5 className="s_mb_0">ВК</h5>

                <p>
                    Схема отработанная: переходим на страницу с видео, получаем embed ссылку, сохраняем в системе.<br />
                    Для получения ссылки необходимо нажать на кнопку получения ссылки для встраивания видео(сверху справа в плеере иконка с угловыми скобками).
                    Далее как и в вимео выбираем код для вставки и оставляем <strong>только ссылку</strong>.
                    <img style={styles.image} className="s_mt_12" src="/images/help/review/review7.png"/>
                </p>

                <p>
                    Таким образом, для видео <a href="https://vk.com/video?z=video1572731_149462834" target="_blank">Swedish House Mafia - One (Your Name)</a>,
                    которая для браузера выглядит так: https://vk.com/video?z=video1572731_149462834, <strong>для сохранения в системе</strong> будет
                    выглядеть так: <strong>//vk.com/video_ext.php?oid=1572731&amp;id=149462834&amp;hash=b61399023b11f89e&amp;hd=2</strong>.
                </p>

                <p>
                    В случае возникновения затруднений прошу писать в <a href="https://vk.com/id1572731" target="_blank">ВК</a> либо
                    на <a href="mailto:tony.grebnev@gmail.com?Subject=Ошибка зыгрузки фото" target="_blank">почту</a>.
                </p>
            </Dialog>
        );
    }

    getStyles() {
        return {
            root:  {
                maxWidth: '1024px'
            },
            image: {
                width: '100%'
            }
        }
    }
}

module.exports = HelpPhoto;