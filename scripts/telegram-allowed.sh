# Sourced by messages.yml poll + route. TELEGRAM_ALLOWED_USER_ID may be a
# comma/space-separated list of numeric Telegram user ids.
telegram_user_allowed() {
  local from="$1"
  local list="${TELEGRAM_ALLOWED_USER_ID:-$TELEGRAM_CHAT_ID}"
  list=$(printf '%s' "$list" | tr -d '[:space:]')
  [ -n "$from" ] && [ "$from" != "null" ] || return 1
  case ",$list," in
    *",$from,"*) return 0 ;;
    *) return 1 ;;
  esac
}
