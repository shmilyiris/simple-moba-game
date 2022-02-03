from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.core import serializers
from game.models.player.player import Player

def getinfo_acapp(request):
    player = Player.objects.get(user=request.user)
    # 返回一个字典
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.photo,
    })


def getinfo_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': "未登录"
        })
    else:
        player = Player.objects.get(user=user)
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.photo,
        })

def getinfo_ranking_time(username):
    players = Player.objects.all()
    usernames = []
    times = []
    time = 0
    for player in players:
        usernames.append(player.user.username)
        times.append(player.survive_time)
        if username == player.user.username:
            time = player.survive_time
    usernames = list(usernames)
    zipped_data = list(zip(times, usernames))
    merge_data = sorted(zipped_data, reverse=True)
    idx = 0
    for (t, p) in merge_data:
        usernames[idx] = p
        times[idx] = t
        if idx == 15 or t < 10:
            break
        idx += 1

    return JsonResponse({
        'result': "success",
        'usernames': usernames[:idx],
        'times': times[:idx],
        'time': time,
    })

def getinfo_ranking_points(username):
    players = Player.objects.all()
    usernames = []
    scores = []
    score = 0
    for player in players:
        usernames.append(player.user.username)
        scores.append(player.score)
        if username == player.user.username:
            score = player.score
    
    usernames = list(usernames)
    zipped_data = list(zip(scores, usernames))
    merge_data = sorted(zipped_data, reverse=True)
    idx = 0
    for (s, p) in merge_data:
        usernames[idx] = p
        scores[idx] = s
        if idx == 15: # 只显示前15名用户
            break
        idx += 1

    return JsonResponse({
        'result': "success",
        'usernames': usernames[:idx],
        'scores': scores[:idx],
        'score': score,
    })

def getinfo(request):
    platform = request.GET.get('platform')
    username = request.GET.get('username')
    if platform == "ACAPP":
        return getinfo_acapp(request)
    elif platform == "WEB":
        return getinfo_web(request)
    elif platform == "ranking_points":
        return getinfo_ranking_points(username)
    elif platform == "ranking_time":
        return getinfo_ranking_time(username)
