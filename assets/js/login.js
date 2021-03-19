$(function() {
    // 点击去注册
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 点击去登录
    $('#link_login').on('click', function() {
            $('.reg-box').hide();
            $('.login-box').show();
        })
        // 表单密码验证
        // 从layui里面获取form对象
    let form = layui.form;
    let layer = layui.layer;
    // 通过form.verify()函数自定义效验规则
    form.verify({
            // 自定义了一个叫pwd的效验规则
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 自定义了一个叫repwd的效验规则
            repwd: function(value) {
                //通过形参拿到的是确认密码框中的内容
                //还需要拿到密码框中的内容
                //然后进行一次等于的判断
                //如果判断失败，则return一个提示消息即可
                let pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码不一致，请重新检查';
                }
            }
        })
        // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);

                }
                layer.msg('注册成功，请登录！');
                // 模拟人点击行为，自动跳转登录页面
                $('#link_login').click();
            })

        })
        // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            // 快速获取登录表单的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！');
                // 下方是获取用于有权限接口的身份认证字符串
                // console.log(res.token);
                // 将登录成功得到的token字符串，保存到localstorage中（浏览器本地存储）
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html';

            }
        })
    })
})