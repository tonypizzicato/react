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
            <Dialog contentStyle={styles.root} title="Загрузка фотоотчета" actions={actions} autoDetectWindowHeight={true} autoScrollBodyContent={true} ref="dialog">
                <p>
                    <strong>Внимание!</strong> Процесс загрузки фотографий изменился и стал надежнее. Прошу ознакомиться с данной инструкцией.<br />
                    Все фото, которые были загружены с проблемами будут удалены.
                </p>

                <p>
                    Для начала загрузки фото необходимо выбрать фотографии для загрузки. Для этого вы можете нажать на область загрузки и в появившемся окне
                    выбрать неободимые файлы, либо перетащить выбранные фотографии из файлового структуры системы.
                    <img style={styles.image} className="s_mt_12" src="/images/help/photos/1.png"/>
                </p>

                <p>
                    После этого фото доступные для загрузки будут отображены в поле загрузки.
                    <img style={styles.image} className="s_mt_12" src="/images/help/photos/2.png"/>
                </p>

                <p>
                    Для начала загрузки файлов на сервер необзодимо нажать круглую кнопку. После этого начнется загрузка.<br />
                    Файлы загружаются на сервер по 10(значение может меняться) штук.<br />
                    <strong>Важно.</strong> После загрузги на сервер, фото загружается на flickr, поэтому процесс загрузки занимает некторое время
                    и обозначается наличием элемента процесса загрузки.
                    <img style={styles.image} className="s_mt_12" src="/images/help/photos/3.png"/>
                    Результат загрузки отображается в окне загрузки появлением специальных иконок.
                    В случае возникновения ошибки появляется иконка крестика.
                    В этом случае необходимо попробовать повторить загрузку фото, которые не удалось загрузить либо сообщить о проблеме администратору.
                    Успешно загруженные фото отображаются под окном загрузки.
                    <img style={styles.image} className="s_mt_12" src="/images/help/photos/4.png"/>
                    После успешной загрузки фото можно сортировать путем перетаскивания фото в поле загруженных файлов,
                    а также удалять путем наведения курсора на фото и нажатием на иконку крестика
                    (на самом деле кнопка удаления занимает верхнюю треть фото и появляется при наведении на фото).
                    <img style={styles.image} className="s_mt_12" src="/images/help/photos/5.png"/>
                </p>

                <p>
                    В случае возникновения проблем прошу писать в <a href="https://vk.com/id1572731" target="_blank">ВК</a> либо
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