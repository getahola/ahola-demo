import { requestDemoSubscribe } from '../demo'
import { t } from '../i18n'
import { Button } from './ui'

/**
 * Shown when a demo visitor taps "Say hi". Chatting isn't part of the preview,
 * so this nudges them to the landing-page waitlist instead.
 */
export function SubscribeModal({ name, onClose }: { name: string; onClose: () => void }) {
  const handleJoin = () => {
    requestDemoSubscribe()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-4xl">👋</div>
        <h3 className="text-lg font-semibold text-slate-800">{t('subTitle')}</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">{t('subText', { name })}</p>
        <div className="mt-5 flex flex-col gap-2">
          <Button onClick={handleJoin}>{t('subCta')}</Button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-600"
          >
            {t('subClose')}
          </button>
        </div>
      </div>
    </div>
  )
}
