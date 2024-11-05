import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const themeColors = {
    surface:'{{options.rootModel.uiStyle.palette.colors.surface.colorCode}}',
    mainText:'{{options.rootModel.uiStyle.palette.colors.mainText.colorCode}}',
    secondaryText:'{{options.rootModel.uiStyle.palette.colors.secondaryText.colorCode}}',
    primary: '{{options.rootModel.uiStyle.palette.colors.primary.colorCode}}',
    'primary-darken-1': '{{options.rootModel.uiStyle.palette.colors.primary-darken-1.colorCode}}',
    secondary: '{{options.rootModel.uiStyle.palette.colors.secondary.colorCode}}',
    'secondary-darken-1': '{{options.rootModel.uiStyle.palette.colors.secondary-darken-1.colorCode}}',
    info: '{{options.rootModel.uiStyle.palette.colors.info.colorCode}}',
    error: '{{options.rootModel.uiStyle.palette.colors.error.colorCode}}',
    warning: '{{options.rootModel.uiStyle.palette.colors.warning.colorCode}}',
    success: '{{options.rootModel.uiStyle.palette.colors.success.colorCode}}',
};

const defaultColors = {
    surface: '#FFFFFF', // 카드 배경색
    mainText:'#000000', // 메인 글자 색
    secondaryText:'#808080', // 서브 글자 색
    primary: '#1976D2', // 버특 및 상단 바 색상
    'primary-darken-1': '#1565C0', // 다이얼로그 상단 바 색상
    secondary: '#424242',
    'secondary-darken-1': '#212121',
    info: '#2196F3',
    error: '#FF5252',
    warning: '#FFC107',
    success: '#4CAF50',
};

Object.keys(themeColors).forEach(key => {
    if (!themeColors[key]) {
        themeColors[key] = defaultColors[key];
    }
});

export default new Vuetify({
    theme: {
        light: true,
        themes: {
            light: themeColors,
        },
    },
});
