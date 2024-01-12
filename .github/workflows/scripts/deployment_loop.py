import os
import subprocess

def build_and_push(repository, dockerfile):
    docker_build=f'docker buildx build \
    -t {registry}/{repository}:{environment}-{full_sha} \
    -t {registry}/{repository}:{environment}-{short_sha}\
    --push \
    -f {dockerfile} . '
    subprocess.run(docker_build, shell=True, text=True, check=True, stdout=subprocess.PIPE, executable='/bin/bash')

registry = os.getenv('REGISTRY')
full_sha = os.getenv('full_sha')
short_sha = os.getenv('short_sha')
environment = os.getenv('ENVIRONMENT')
github_sha_before = os.getenv('github_event_before')

git_command = f"git diff --name-only ${{ github_event_before }} ${{github_sha}} | uniq"
images = []

changed_files = subprocess.run(git_command, shell=True, text=True, check=True, stdout=subprocess.PIPE, executable='/bin/bash')
output = changed_files.stdout.strip()


if "client/" in output:
    # Change to the server directory
    os.chdir('client/')
    build_and_push("frontend", "Dockerfile")
    os.chdir('..')
    images.append("frontend")

if "server/" in output:
    # Change to the server directory
    os.chdir('server/')
    build_and_push("backend", "Dockerfile.backend")
    os.chdir('..')
    images.append("backend")

if "server/" in output:
    # Change to the server directory
    os.chdir('server/')
    build_and_push("migrations", "Dockerfile.migrations")
    os.chdir('..')
    images.append("migrations")

warpped_images = "'" + "{" + "images_json" + "'" + str(images) + "'" + "}" + "'"
os.environ['GITHUB_OUTPUT']=warpped_images

