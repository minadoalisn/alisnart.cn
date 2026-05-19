#!/usr/bin/env python3
"""
艾里森官网一键部署脚本
自动同步本地修改到服务器，确保线上版本与Git仓库一致

功能：
1. 上传修改的HTML文件
2. 上传新增/更新的图片
3. 验证线上状态
4. Git提交并推送
5. 推送百度URL收录
"""

import paramiko
from pathlib import Path
import subprocess
import requests
import sys
from datetime import datetime

# 配置
SERVER_HOST = "8.138.214.74"
SERVER_USER = "root"
KEY_FILE = Path(r"C:\Users\35810\AppData\Local\hermes\cache\documents\doc_2220f6f2ce9c_alisnart.cn.pem") # 更新密钥文件路径
SERVER_BASE = "/usr/share/nginx/html"

REPO_ROOT = Path(r"D:\艾里森官网")
BAIDU_TOKEN = "7b3e99cf8369883da4fbdc05a82a7051"

def ssh_connect():
    """建立SSH连接"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        # 使用密钥文件进行认证
        ssh.connect(SERVER_HOST, username=SERVER_USER, key_filename=str(KEY_FILE), timeout=10)
        return ssh
    except Exception as e:
        print(f"❌ SSH连接失败: {e}")
        print("请检查密钥文件路径、权限或网络连接")
        return None

def upload_files(ssh, files_map):
    """批量上传文件"""
    sftp = ssh.open_sftp()
    uploaded = []
    
    for local_rel, remote_rel in files_map.items():
        local_path = REPO_ROOT / local_rel
        remote_path = f"{SERVER_BASE}/{remote_rel}"
        
        if not local_path.exists():
            print(f"⚠️  本地文件不存在: {local_rel}")
            continue
        
        try:
            # 确保远程目录存在
            remote_dir = "/".join(remote_path.split("/")[:-1])
            try:
                sftp.stat(remote_dir)
            except FileNotFoundError: # 如果目录不存在，就创建
                ssh.exec_command(f"mkdir -p {remote_dir}")
                # 重新检查确保目录已创建
                max_retries = 5
                for _ in range(max_retries):
                    try:
                        sftp.stat(remote_dir)
                        break
                    except FileNotFoundError:
                        import time
                        time.sleep(1) # 等待一秒再尝试
                else:
                    raise Exception(f"Failed to create remote directory {remote_dir}")
            
            sftp.put(str(local_path), remote_path)
            size_kb = local_path.stat().st_size / 1024
            uploaded.append(remote_rel)
            print(f"✓ {remote_rel} ({size_kb:.1f}KB)")
        except Exception as e:
            print(f"❌ {remote_rel}: {e}")
    
    sftp.close()
    return uploaded

def verify_online(urls):
    """验证线上状态"""
    print("\n=== 验证线上状态 ===")
    all_ok = True
    
    for url in urls:
        try:
            r = requests.head(f"https://alisnart.cn/{url}", timeout=5)
            status = "✓" if r.status_code == 200 else "❌"
            print(f"{status} {url} ({r.status_code})")
            if r.status_code != 200:
                all_ok = False
        except Exception as e:
            print(f"❌ {url}: {e}")
            all_ok = False
    
    return all_ok

def git_commit_push(message):
    """Git提交并推送"""
    print("\n=== Git提交 ===")
    try:
        subprocess.run(["git", "add", "."], cwd=REPO_ROOT, check=True)
        subprocess.run(["git", "commit", "-m", message], cwd=REPO_ROOT, check=True)
        subprocess.run(["git", "push", "origin", "main"], cwd=REPO_ROOT, check=True)
        print("✓ Git推送成功")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Git操作失败: {e}")
        return False

def push_baidu(urls):
    """推送百度收录"""
    print("\n=== 百度URL推送 ===")
    
    full_urls = [f"https://alisnart.cn/{url}" for url in urls]
    # api_url = f"http://data.zz.baidu.com/urls?site=alisnart.cn&token={BAIDU_TOKEN}"
    # print("百度推送功能已暂时禁用")
    # return True

    
    try:
        r = requests.post(
            api_url,
            headers={"Content-Type": "text/plain"},
            data="\n".join(full_urls),
            timeout=10
        )
        print(f"状态码: {r.status_code}")
        print(f"响应: {r.text}")
        return r.status_code == 200
    except Exception as e:
        print(f"❌ 推送失败: {e}")
        return False

def main():
    print("=== 艾里森官网一键部署 ===")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # 文件清单（可根据实际情况修改）
    files_to_upload = {
        # 中文站HTML
        "cases.html": "cases.html",
        "cases/lantern-tree-plaza.html": "cases/lantern-tree-plaza.html",
        "cases/moonlit-wonderland.html": "cases/moonlit-wonderland.html",
        "cases/celestial-ring-plaza.html": "cases/celestial-ring-plaza.html",
        "cases/han-moon-peacock-swing.html": "cases/han-moon-peacock-swing.html",
        
        # 英文站HTML（10个项目页）
        "en_site/projects/lantern-tree-plaza.html": "en_site/projects/lantern-tree-plaza.html",
        "en_site/projects/moonlit-wonderland.html": "en_site/projects/moonlit-wonderland.html",
        "en_site/projects/celestial-ring-plaza.html": "en_site/projects/celestial-ring-plaza.html",
        "en_site/projects/han-moon-peacock-swing.html": "en_site/projects/han-moon-peacock-swing.html",
        "en_site/projects/heart-pavilion.html": "en_site/projects/heart-pavilion.html",
        "en_site/projects/swan-drone-cruise.html": "en_site/projects/swan-drone-cruise.html",
        "en_site/projects/dragon-cloud.html": "en_site/projects/dragon-cloud.html",
        "en_site/projects/biomorphic-led-canopy.html": "en_site/projects/biomorphic-led-canopy.html",
        "en_site/projects/tropical-resort-archway.html": "en_site/projects/tropical-resort-archway.html",
        "en_site/projects/whale-sculpture.html": "en_site/projects/whale-sculpture.html",
        
        # 图片（如有更新）
        "cases-images/lantern-tree-plaza.webp": "cases-images/lantern-tree-plaza.webp",
        "cases/images/lantern-tree-plaza.webp": "cases/images/lantern-tree-plaza.webp",
        "en_site/assets/images/projects/lantern-tree-plaza.webp": "en_site/assets/images/projects/lantern-tree-plaza.webp",
        
        # IndexNow验证文件
        "7b3e99cf8369883da4fbdc05a82a7051.txt": "7b3e99cf8369883da4fbdc05a82a7051.txt"
    }
    
    # 添加国潮几何光影门相关文件
    files_to_upload["cases/guochao-geometric-gate.html"] = "cases/guochao-geometric-gate.html"
    files_to_upload["en_site/projects/guochao-geometric-gate.html"] = "en_site/projects/guochao-geometric-gate.html"
    files_to_upload["cases-images/guochao-geometric-gate.webp"] = "cases-images/guochao-geometric-gate.webp"
    files_to_upload["cases/images/guochao-geometric-gate.webp"] = "cases/images/guochao-geometric-gate.webp"
    files_to_upload["en_site/assets/images/projects/guochao-geometric-gate.webp"] = "en_site/assets/images/projects/guochao-geometric-gate.webp"

    # 建立SSH连接
    ssh = ssh_connect()
    if not ssh:
        print("\n请手动上传文件或修复SSH连接后重试。")
        return 1
    
    # 上传文件
    print("=== 上传文件到服务器 ===")
    uploaded = upload_files(ssh, files_to_upload)
    ssh.close()
    
    if not uploaded:
        print("\n❌ 没有文件成功上传")
        return 1
    
    # 验证线上状态
    urls_to_verify = [
        "cases.html",
        "cases/lantern-tree-plaza.html",
        "en_site/projects/lantern-tree-plaza.html",
        "cases/guochao-geometric-gate.html", # 新产品页
        "en_site/projects/guochao-geometric-gate.html", # 新产品页英文版
        "7b3e99cf8369883da4fbdc05a82a7051.txt" # 验证密钥文件
    ]
    
    if not verify_online(urls_to_verify):
        print("\n⚠️  部分文件线上验证失败，请检查")
    
    # Git提交 (如果此前Git推送失败，这里会再次尝试)
    commit_msg = f"Site update: {datetime.now().strftime('%Y-%m-%d %H:%M')} - GEO全站改造+维护机制+国潮几何光影门上线"
    git_commit_push(commit_msg)
    
    # 百度推送
    urls_to_push = [
        "cases.html",
        "cases/lantern-tree-plaza.html",
        "cases/moonlit-wonderland.html",
        "cases/celestial-ring-plaza.html",
        "cases/han-moon-peacock-swing.html",
        "cases/guochao-geometric-gate.html", # 新产品页
    ]
    push_baidu(urls_to_push)
    
    print("\n✅ 部署完成")
    print(f"已上传 {len(uploaded)} 个文件")
    return 0

if __name__ == "__main__":
    exit(main())