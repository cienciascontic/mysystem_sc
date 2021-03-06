#! env ruby
# For use in Jenkins: Build a locally deployed demo app.


checkout_result = %x[git stash]
checkout_result = %x[git checkout -f]

PROJECT_DIR     = ENV['PROJECT_DIR'] || "/tmp"
COMMIT_HASH     = ENV['COMMIT_HASH'] || %x[git log -1 --format=%H][0..7]
APP_NAME        = ENV['APP_NAME']    || "my_system"

URL_PREFIX      = "/#{APP_NAME}/releases/#{COMMIT_HASH}"
RELEASE_DIR     = "#{PROJECT_DIR}#{URL_PREFIX}"
BUILD_DIR       = "build_folder"

File.open('Buildfile', 'a') do |file|
  file.puts
  file.puts "config :all,"
  file.puts "   :url_prefix => '#{URL_PREFIX}'"
end

# need to rerun bundle install probably because of git checkout -f
%x[bundle install]

def doit(command, fail_quietly = false, verbose = true)
  puts command if verbose
  %x[#{command}]
  unless fail_quietly or $?.success?
    clean_up
    raise "Exception in shell command: #{$?.to_s}"
  end
end

# remove modifications to the working directory
# includding uncommitted changes and modifications
# to the build file.
def clean_up
  %x[rm -rf   #{BUILD_DIR}]
  checkout_result = %x[git checkout -f]
  checkout_result = %x[git stash apply]
end

# clean
doit %[rm -rf   #{BUILD_DIR}],   true
doit %[rm -rf   #{RELEASE_DIR}], true
doit %[mkdir -p #{RELEASE_DIR}]

# build
puts "***  Building #{APP_NAME} #{COMMIT_HASH} in #{BUILD_DIR}"
doit %[bundle exec sc-build #{APP_NAME} --mode="demo" --build=#{COMMIT_HASH} -r -c --languages=en --buildroot="#{BUILD_DIR}"]

# copy the build to the distro directory
puts "***  copying #{BUILD_DIR}#{URL_PREFIX} #{RELEASE_DIR} ***"
doit %[cp -r #{BUILD_DIR}/#{URL_PREFIX}/* #{RELEASE_DIR}]

# copy the authoring files too:
puts "***  copying authoring files to #{RELEASE_DIR} ***"
doit %[cp -r public/authoring #{RELEASE_DIR}]

# symlink top level files for convinience:
doit %[ln -sfn #{RELEASE_DIR}/#{APP_NAME}/en/#{COMMIT_HASH}/index.html #{RELEASE_DIR}/#{APP_NAME}/index.html]
doit %[ln -sfn #{RELEASE_DIR}/#{APP_NAME}/index.html #{RELEASE_DIR}/index.html]
doit %[ln -sfn #{RELEASE_DIR}/#{APP_NAME}/authoring #{RELEASE_DIR}/authoring]

# link to current release:
doit %[ln -sfn #{RELEASE_DIR} #{PROJECT_DIR}/#{APP_NAME}/current]

# convinience links:
doit %[ln -sfn #{PROJECT_DIR}/#{APP_NAME}/current/index.html #{PROJECT_DIR}/#{APP_NAME}/index.html]
doit %[ln -sfn #{PROJECT_DIR}/#{APP_NAME}/current/authoring #{PROJECT_DIR}/#{APP_NAME}/authoring]
doit %[ln -sfn #{PROJECT_DIR}/#{APP_NAME}/current #{PROJECT_DIR}/#{APP_NAME}/#{APP_NAME}] 
doit %[ln -sfn #{PROJECT_DIR}/#{APP_NAME}/authoring #{PROJECT_DIR}/authoring]
doit %[ln -sfn #{PROJECT_DIR}/#{APP_NAME}/index.html #{PROJECT_DIR}/index.html]

# TODO: Maybe Actually delete old checkouts?
old_files = %x[ls -t #{PROJECT_DIR}/#{APP_NAME}/releases | tail -n +5]
old_files.split.each do |old_file|
  puts "deleting #{old_file}"
  puts "rm -rf #{PROJECT_DIR}/#{APP_NAME}/releases/#{old_file}  (just kidding)"
end

clean_up()