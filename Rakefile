
task :default => [:wise]
desc "build a wise-4 step from the standard sprout-core build"
task :wise do
  begin
    require 'resource_squasher'
    # clean and build release
    %x[sc-build -rc my_system]
    # compact and rewrite for wise4
    %x[rm -rf wise4]
    %x[rezsquish squash --project_name=my_system --output_dir=wise4]
  rescue LoadError
    puts "You need to install the resource squasher gem like so:"
    puts "  gem install ./resource_squasher-0.0.1.gem"
  end

end

# builds mysystem for wise-4 TODO: Make this a rake task or something.
# The sc-build tool is pretty opaque to me after reading the source for 20 min.


