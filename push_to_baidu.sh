#!/bin/bash
# 百度搜索资源平台主动推送脚本
# 自动推送网站所有页面到百度，加速收录

# ================== 配置信息 ==================
BAIDU_TOKEN="${BAIDU_PUSH_TOKEN:-}"
SITE_URL="https://alisnart.cn"
PUSH_API="http://data.zz.baidu.com/urls?site=${SITE_URL}&token=${BAIDU_TOKEN}"

# ================== 要推送的页面列表 ==================
URLS=(
    "${SITE_URL}/"
    "${SITE_URL}/index.html"
    "${SITE_URL}/about.html"
    "${SITE_URL}/services.html"
    "${SITE_URL}/cases.html"
    "${SITE_URL}/sitemap.xml"
)

# ================== 推送函数 ==================
push_urls() {
    if [ -z "${BAIDU_TOKEN}" ]; then
        echo "❌ 缺少 BAIDU_PUSH_TOKEN 环境变量，已停止推送。"
        return 1
    fi

    echo "=================================================="
    echo "百度搜索资源平台主动推送脚本"
    echo "=================================================="
    echo ""
    
    # 将URL列表转换为文本格式
    URL_LIST=$(printf "%s\n" "${URLS[@]}")
    
    echo "正在推送 ${#URLS[@]} 个URL到百度..."
    echo "推送接口: ${PUSH_API}"
    echo "推送URLs:"
    echo "${URL_LIST}"
    echo "--------------------------------------------------"
    
    # 使用curl推送
    RESPONSE=$(curl -s -X POST \
        -H 'Content-Type: text/plain' \
        --data-binary "${URL_LIST}" \
        "${PUSH_API}")
    
    echo "响应内容: ${RESPONSE}"
    echo ""
    
    # 解析响应
    if echo "${RESPONSE}" | grep -q '"success"'; then
        SUCCESS=$(echo "${RESPONSE}" | grep -o '"success":[0-9]*' | cut -d: -f2)
        echo "✅ 成功推送 ${SUCCESS} 个URL"
    fi
    
    if echo "${RESPONSE}" | grep -q '"remain"'; then
        REMAIN=$(echo "${RESPONSE}" | grep -o '"remain":[0-9]*' | cut -d: -f2)
        echo "📊 今日剩余推送次数: ${REMAIN}"
    fi
    
    if echo "${RESPONSE}" | grep -q '"error"'; then
        echo "❌ 推送失败，请检查token和网站地址"
    fi
    
    echo ""
    echo "=================================================="
    echo "推送完成！"
    echo "=================================================="
}

# ================== 执行推送 ==================
push_urls
