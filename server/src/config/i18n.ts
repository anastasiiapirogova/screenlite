import i18next from 'i18next'
import i18nextFsBackend from 'i18next-fs-backend'
import * as i18nextMiddleware from 'i18next-http-middleware'
import path from 'path'

i18next
    .use(i18nextFsBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: path.join(process.cwd(), 'src/locales', '{{lng}}', '{{ns}}.json'),
        },
        fallbackLng: 'en',
        preload: ['en'],
    })

export const i18n = i18next