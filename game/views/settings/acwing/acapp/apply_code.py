from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache

def get_state():
    ans = ""
    for i in range(8):
        ans += str(randint(0, 9))
    return ans

def apply_code(request):
    appid = "636"
    redirect_uri = quote("https://app636.acapp.acwing.com.cn/settings/acwing/acapp/receive_code/")
    scope = "userinfo"
    state = get_state()

    cache.set(state, True, 7200)

    return JsonResponse({
        'result': "success",
        'appid': appid,
        'redirect_uri': redirect_uri,
        'scope': scope,
        'state': state,
    })
