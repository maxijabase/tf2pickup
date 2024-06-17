import { collections } from '../../../database/collections'
import { GameState, type GameModel } from '../../../database/models/game.model'
import { IconCopy } from '../../../html/components/icons'
import type { SteamId64 } from '../../../shared/types/steam-id-64'

export function ConnectInfo(props: { game: GameModel; actor: SteamId64 | undefined }) {
  const csBoxVisible = [
    GameState.created,
    GameState.configuring,
    GameState.launching,
    GameState.started,
  ].includes(props.game.state)

  return (
    <div id={`game-${props.game.number}-connect-info`} class="flex flex-col gap-2">
      {csBoxVisible ? <ConnectString game={props.game} actor={props.actor} /> : <></>}
    </div>
  )
}

async function ConnectString(props: { game: GameModel; actor: SteamId64 | undefined }) {
  let csBoxContent: JSX.Element
  let csBtn = <></>
  switch (props.game.state) {
    case GameState.created:
      csBoxContent = <i>waiting for server...</i>
      break
    case GameState.configuring:
      csBoxContent = <i>configuring server...</i>
      break
    default: {
      const connectString =
        ((await actorInGame(props.game, props.actor))
          ? props.game.connectString
          : props.game.stvConnectString) ?? ''
      csBoxContent = connectString
      csBtn = (
        <button
          class="hover:text-abru-light-85"
          _={`
        on click js
          navigator.clipboard.writeText("${connectString}").then(() => console.log('copied'))
        end
        `}
        >
          <IconCopy size={24} />
          <span class="sr-only">Copy connect string</span>
        </button>
      )
    }
  }

  return (
    <div class="connect-string">
      <div
        class="fade block flex-1 cursor-text select-all overflow-hidden whitespace-nowrap bg-abru-light-5 text-base text-abru-light-75"
        aria-label="Connect string"
        aria-readonly
      >
        {csBoxContent}
      </div>

      {csBtn}
    </div>
  )
}

async function actorInGame(game: GameModel, actor?: SteamId64) {
  if (!actor) {
    return false
  }

  const player = await collections.players.findOne({ steamId: actor })
  if (player === null) {
    throw new Error(`player ${actor} does not exist`)
  }

  return game.slots.some(slot => slot.player.equals(player._id))
}
