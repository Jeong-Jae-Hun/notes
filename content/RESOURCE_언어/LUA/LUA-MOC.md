# Lua MOC

> Lua & OpenResty 학습 자료 맵

## Guides

- [[LANG-LUA-OPENRESTY-학습가이드|OpenResty & Lua Guide]] - TypeScript 개발자를 위한 종합 가이드

## Key Concepts

### OpenResty = Nginx + Lua
동적 로직, Redis/MySQL 연동, HTTP API 호출 가능

### Lua 핵심
- **Table**: 배열 + 객체 (인덱스 1부터 시작!)
- **local**: 항상 local 키워드 사용
- **nil**: null과 같음

## Quick Reference

```lua
-- 변수
local name = "value"
local user = { name = "Hong", age = 25 }

-- 함수
local function greet(name)
    return "Hello, " .. name
end

-- 배열 (1부터!)
local fruits = {"apple", "banana"}
print(fruits[1])  -- "apple"
```

### ngx_lua API
```lua
ngx.var.uri          -- 요청 URI
ngx.req.get_headers() -- 헤더
ngx.say("response")  -- 응답
ngx.exit(ngx.HTTP_OK)
```

---

#type/moc #topic/lua #topic/openresty
