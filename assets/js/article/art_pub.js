$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl_cate', res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                    // 因为是动态渲染到页面，layui监听不到动态渲染的数据，所以一定要记得调用form.render()方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length <= 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })
    var art_state = '已发布';
    $('#btnsave2').on('click', function() {
        art_state = '草稿';
    })

    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        // fd.forEach(function (v, k) {
        //   console.log(k, v);
        // })

        // 将封面图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象 blob 就是文件对象,放到formdata中
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //注意: 如果给服务器提交的是formData数据
            //必须添加下面两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功');

                location.href = '/article/art_list.html';

            }
        })
    }
})