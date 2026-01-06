---
tags:
  - type/guide
  - topic/ai
  - topic/productivity
---

# Claude Code로 Apple Calendar 관리하기

> AppleScript 기반, MCP 불필요

## 개요

Claude Code에서 `/cal` 커맨드로 Apple Calendar를 직접 관리. 일정 조회, 추가, 삭제, TODO 기반 스케줄 생성까지 가능.

## 사용법

```bash
/cal                    # 오늘 일정 조회
/cal today              # 오늘 일정 조회
/cal week               # 이번 주 일정
/cal add 업무 "회의" 14:00 15:00   # 일정 추가
/cal delete "회의"      # 일정 삭제
/cal from-todo          # TODO 기반 스케줄 생성 (대화형)
```

## 설정 방법

### 1. 스크립트 생성

`~/.dotfiles/claude/scripts/cal.sh`:

```bash
#!/bin/bash
set -e

CMD="${1:-today}"
shift 2>/dev/null || true

# Calendar 앱 실행 (백그라운드)
open -ga Calendar 2>/dev/null || true
sleep 0.5

case "$CMD" in
  today)
    osascript -e '
    set today to current date
    set todayStart to today - (time of today)
    set todayEnd to todayStart + 1 * days

    tell application "Calendar"
      set output to ""
      set calList to {"업무", "개인"}
      repeat with calName in calList
        try
          set cal to calendar calName
          set evts to (every event of cal whose start date ≥ todayStart and start date < todayEnd)
          if (count of evts) > 0 then
            set output to output & "📅 " & calName & linefeed
            repeat with evt in evts
              set evtStart to start date of evt
              set evtEnd to end date of evt
              set evtTitle to summary of evt
              set startTime to text 1 thru 5 of (time string of evtStart)
              set endTime to text 1 thru 5 of (time string of evtEnd)
              set output to output & "  " & startTime & "-" & endTime & " " & evtTitle & linefeed
            end repeat
          end if
        end try
      end repeat
      if output = "" then
        return "오늘 일정 없음"
      else
        return output
      end if
    end tell'
    ;;

  week)
    osascript -e '
    set today to current date
    set todayStart to today - (time of today)
    set weekEnd to todayStart + 7 * days

    tell application "Calendar"
      set output to ""
      set calList to {"업무", "개인"}
      repeat with calName in calList
        try
          set cal to calendar calName
          set evts to (every event of cal whose start date ≥ todayStart and start date < weekEnd)
          if (count of evts) > 0 then
            set output to output & "📅 " & calName & linefeed
            repeat with evt in evts
              set evtStart to start date of evt
              set evtEnd to end date of evt
              set evtTitle to summary of evt
              set dateStr to (month of evtStart as integer) & "/" & (day of evtStart)
              set startTime to text 1 thru 5 of (time string of evtStart)
              set endTime to text 1 thru 5 of (time string of evtEnd)
              set output to output & "  " & dateStr & " " & startTime & "-" & endTime & " " & evtTitle & linefeed
            end repeat
          end if
        end try
      end repeat
      if output = "" then
        return "이번 주 일정 없음"
      else
        return output
      end if
    end tell'
    ;;

  add)
    CAL_NAME="${1:-업무}"
    TITLE="${2:-새 일정}"
    START_TIME="${3:-09:00}"
    END_TIME="${4:-10:00}"
    DAYS_OFFSET="${5:-0}"

    osascript -e "
    tell application \"Calendar\"
      set targetCal to calendar \"$CAL_NAME\"
      set eventDate to current date
      set eventDate to eventDate + ($DAYS_OFFSET * days)
      set time of eventDate to 0

      set startHour to (text 1 thru 2 of \"$START_TIME\") as integer
      set startMin to (text 4 thru 5 of \"$START_TIME\") as integer
      set startDate to eventDate + (startHour * hours) + (startMin * minutes)

      set endHour to (text 1 thru 2 of \"$END_TIME\") as integer
      set endMin to (text 4 thru 5 of \"$END_TIME\") as integer
      set endDate to eventDate + (endHour * hours) + (endMin * minutes)

      make new event at end of events of targetCal with properties {summary:\"$TITLE\", start date:startDate, end date:endDate}

      return \"✅ 추가됨: $TITLE ($START_TIME-$END_TIME) → $CAL_NAME\"
    end tell"
    ;;

  delete)
    SEARCH="${1:-}"
    if [ -z "$SEARCH" ]; then
      echo "Usage: cal.sh delete <검색어>"
      exit 1
    fi

    osascript -e "
    tell application \"Calendar\"
      set deleted to 0
      set calList to {\"업무\", \"개인\"}
      set today to current date
      set todayStart to today - (time of today)
      set weekEnd to todayStart + 7 * days

      repeat with calName in calList
        try
          set cal to calendar calName
          set evts to (every event of cal whose summary contains \"$SEARCH\" and start date ≥ todayStart and start date < weekEnd)
          repeat with evt in evts
            delete evt
            set deleted to deleted + 1
          end repeat
        end try
      end repeat

      if deleted = 0 then
        return \"❌ '$SEARCH' 일정을 찾을 수 없음\"
      else
        return \"✅ \" & deleted & \"개 일정 삭제됨\"
      end if
    end tell"
    ;;

  *)
    echo "Usage: cal.sh [today|week|add|delete]"
    ;;
esac
```

### 2. 커맨드 파일 생성

`~/.dotfiles/claude/commands/cal.md`:

```markdown
Apple Calendar 관리. 일정 조회, 추가, 삭제, TODO 기반 스케줄 생성.

## 명령어

~/.dotfiles/claude/scripts/cal.sh $ARGUMENTS

## 사용법

- `/cal` 또는 `/cal today` - 오늘 일정 조회
- `/cal week` - 이번 주 일정
- `/cal add 업무 "회의" 14:00 15:00` - 일정 추가
- `/cal delete "회의"` - 일정 삭제

## from-todo (대화형)

Claude가 TODO 목록을 분석해서 시간 블록을 제안하고, 확인 후 캘린더에 등록.
```

### 3. 권한 설정

`~/.dotfiles/claude/settings.json`에 추가:

```json
{
  "permissions": {
    "allow": [
      "Bash(~/.dotfiles/claude/scripts/cal.sh:*)"
    ]
  }
}
```

### 4. 실행 권한

```bash
chmod +x ~/.dotfiles/claude/scripts/cal.sh
```

## 캘린더 설정

스크립트는 기본적으로 `업무`, `개인` 두 캘린더를 사용. Apple Calendar에서 해당 이름의 캘린더를 생성하거나, 스크립트의 `calList`를 수정.

## from-todo 기능

`/cal from-todo` 실행 시 Claude가 대화형으로 처리:

1. 현재 세션의 TODO 목록 확인
2. 시간 블록 제안
3. 사용자 확인 후 캘린더에 등록

```
/cal from-todo

→ 오늘 TODO:
  - PR 코드 리뷰
  - API 문서 작성
  - 버그 수정 (로그인 이슈)

→ 제안 스케줄:
  13:00-13:30 PR 코드 리뷰
  13:30-15:30 API 문서 작성
  15:30-17:30 버그 수정 (로그인 이슈)

→ 이대로 등록할까요?
```

## 제한 사항

- macOS 전용 (AppleScript 기반)
- 최초 실행 시 캘린더 접근 권한 팝업 발생
- 반복 일정, 알림 설정은 미지원

---

#project/dev-setup #topic/productivity #type/guide
