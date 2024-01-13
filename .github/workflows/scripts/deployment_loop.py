import os
import subprocess

def build_and_push(repository, dockerfile):
    docker_build=f'docker buildx build \
    -t {registry}/{repository}:{environment}-{full_sha} \
    -t {registry}/{repository}:{environment}-{short_sha}\
    --push \
    -f {dockerfile} . '
    subprocess.run(docker_build, shell=True, text=True, capture_output=True)

registry = os.getenv('REGISTRY')
print("registry:" + registry)
full_sha = os.getenv('full_sha')
print("full_sha:" + full_sha)
short_sha = os.getenv('short_sha')
print("short_sha:" + short_sha)
environment = os.getenv('ENVIRONMENT')
print("environment:" + environment)
github_event_before = os.getenv('github_event_before')
print("github_sha_before:" + github_event_before)

git_command = f"git diff --name-only {str(github_event_before)} {str(full_sha)} | uniq"
print("git_command:" + git_command)
changed_files = subprocess.run(git_command, shell=True, text=True, capture_output=True)
changed_files_output = changed_files.stdout.strip()
print("changed_files_output:" + changed_files_output)
images = []

if "client/" in changed_files_output:
    # Change to the server directory
    os.chdir('client/')
    build_and_push("frontend", "Dockerfile")
    os.chdir('..')
    images.append("frontend")

if "server/" in changed_files_output:
    # Change to the server directory
    os.chdir('server/')
    build_and_push("backend", "Dockerfile.backend")
    os.chdir('..')
    images.append("backend")

if "server/" in changed_files_output:
    # Change to the server directory
    os.chdir('server/')
    build_and_push("migrations", "Dockerfile.migrations")
    os.chdir('..')
    images.append("migrations")

warpped_images = "'" + "{" + "images_json" + "'" + str(images) + "'" + "}" + "'"
os.environ['GITHUB_OUTPUT']=warpped_images

