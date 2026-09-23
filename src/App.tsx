import { useEffect, useState } from 'react'
import './cards.css'

type Streamer = {
  username: string
  avatar?: string | null
  twitch_url?: string | null
  is_live: boolean
}

type StreamersResponse = {
  streamers: Streamer[]
}

type FilterOption = 'all' | 'online' | 'offline'
type Theme = 'light' | 'dark'

const FALLBACK_AVATAR = '/chess-avatar.svg'
const STREAMERS_API_URL = 'https://api.chess.com/pub/streamers'
const FILTER_OPTIONS: Array<{ value: FilterOption; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'online', label: 'Somente Online' },
  { value: 'offline', label: 'Somente Offline' },
]

function StreamerCard({ streamer }: { streamer: Streamer }) {
  const statusLabel = streamer.is_live ? 'Online' : 'Offline'

  const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (event.currentTarget.src.endsWith(FALLBACK_AVATAR)) {
      return
    }

    event.currentTarget.src = FALLBACK_AVATAR
  }

  return (
    <article className="streamer-card">
      <div className="streamer-card__identity">
        <img
          className="streamer-card__avatar"
          src={streamer.avatar || FALLBACK_AVATAR}
          alt={`Avatar de ${streamer.username}`}
          onError={handleAvatarError}
        />
        <div className="streamer-card__details">
          <h2>{streamer.username}</h2>
          {streamer.twitch_url ? (
            <a
              className="streamer-card__link"
              href={streamer.twitch_url}
              target="_blank"
              rel="noreferrer"
            >
              Acessar canal na Twitch
            </a>
          ) : (
            <span className="streamer-card__link streamer-card__link--unavailable">
              Canal da Twitch indisponível
            </span>
          )}
        </div>
      </div>
      <div className="streamer-card__status" aria-label={`Status: ${statusLabel}`}>
        <span className={`status-dot status-dot--${streamer.is_live ? 'online' : 'offline'}`} />
        <span>{statusLabel}</span>
      </div>
    </article>
  )
}

function App() {
  const [streamers, setStreamers] = useState<Streamer[]>([])
  const [filter, setFilter] = useState<FilterOption>('all')
  const [usernameQuery, setUsernameQuery] = useState('')
  const [appliedUsername, setAppliedUsername] = useState('')
  const [theme, setTheme] = useState<Theme>('light')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadStreamers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(STREAMERS_API_URL, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`A API respondeu com status ${response.status}.`)
        }

        const apiResponse = (await response.json()) as StreamersResponse
        setStreamers(apiResponse.streamers)
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return
        }

        setStreamers([])
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível carregar os streamers.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadStreamers()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    return () => {
      delete document.documentElement.dataset.theme
    }
  }, [theme])

  const filteredStreamers = streamers.filter((streamer) => {
    const matchesUsername = streamer.username
      .toLowerCase()
      .includes(appliedUsername.trim().toLowerCase())

    if (!matchesUsername) {
      return false
    }

    if (filter === 'online') {
      return streamer.is_live
    }

    if (filter === 'offline') {
      return !streamer.is_live
    }

    return true
  })

  return (
    <main className="app-shell" data-filter={filter} data-theme={theme}>
      <header className="app-header">
        <div>
          <p className="app-header__eyebrow">Chess.com streamers</p>
          <h1>Streamers de xadrez</h1>
          <h6>Powered by Oakbr</h6>
          <p className="app-header__summary">
            {isLoading
              ? 'Buscando transmissões ao vivo...'
              : `${filteredStreamers.length} streamers exibidos`}
          </p>
        </div>
        <button
          className="theme-toggle"
          type="button"
          aria-pressed={theme === 'dark'}
          aria-label={`Ativar tema ${theme === 'light' ? 'escuro' : 'claro'}`}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
        </button>
      </header>

      <nav className="filter-bar" aria-label="Filtrar streamers por status">
        <div className="filter-bar__status-options">
          {FILTER_OPTIONS.map((option) => (
            <button
              className={`filter-button${filter === option.value ? ' filter-button--active' : ''}`}
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <form
          className="username-filter"
          onSubmit={(event) => {
            event.preventDefault()
            setAppliedUsername(usernameQuery)
          }}
        >
          <label htmlFor="username-search">Buscar por username</label>
          <div className="username-filter__controls">
            <input
              id="username-search"
              type="search"
              value={usernameQuery}
              placeholder="Digite um username"
              onChange={(event) => setUsernameQuery(event.target.value)}
            />
            <button className="filter-button filter-button--apply" type="submit">
              Aplicar
            </button>
          </div>
        </form>
      </nav>

      {isLoading && <p className="state-message">Carregando streamers...</p>}
      {!isLoading && error && <p className="state-message state-message--error">{error}</p>}
      {!isLoading && !error && streamers.length === 0 && (
        <p className="state-message">Nenhum streamer encontrado.</p>
      )}
      {!isLoading && !error && streamers.length > 0 && filteredStreamers.length === 0 && (
        <p className="state-message">Nenhum streamer corresponde a este filtro.</p>
      )}
      {!isLoading && !error && filteredStreamers.length > 0 && (
        <section className="streamers-grid" aria-label="Lista de streamers">
          {filteredStreamers.map((streamer) => (
            <StreamerCard key={streamer.username} streamer={streamer} />
          ))}
        </section>
      )}
    </main>
  )
}

export default App
