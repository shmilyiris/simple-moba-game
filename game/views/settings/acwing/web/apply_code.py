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
    redirect_uri = quote("https://app636.acapp.acwing.com.cn/settings/acwing/web/receive_code/")
    scope = "userinfo"
    state = get_state()

    cache.set(state, True, 7200)
    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"
    apply_code_url_res = apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (appid, redirect_uri, scope, state)
    return JsonResponse({
        'result': "success",
        'apply_code_url': apply_code_url_res,
    })
