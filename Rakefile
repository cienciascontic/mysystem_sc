
require 'erb'

@tomcat_dir         = ENV['CATALINA_HOME']
@sc_project_name    = "my_system"
@project_title      = "My System"
@wise_step_name     = "mysystem2"
@template_directory = "wise4/#{@wise_step_name}"
@output_directory   = "vle/node/#{@wise_step_name}"
@template_suffix    = ".erb"

# Build / Version info goes into the HTML HEAD / Meta section
@git_sha         = %x[git log -n1 --pretty="%H" ].chomp.strip
@git_short_sha   = %x[git log -n1 --pretty="%h" ].chomp.strip
@git_time        = %x[git log -n1 --pretty="%ad" ].chomp.strip
@git_branch      = %x[git log -n1 --pretty="%d"].chomp.strip
@sc_build_number = %x[sc-build-number #{@sc_project_name}].chomp.strip
@sc_build_time   = Time.now.to_s
@git_commit_link = "https://github.com/concord-consortium/mysystem_sc/commits/#{@git_sha}"

task :default => [:wise]

desc "package sproutcore for for a wise4 deployment"
task :wise => [:build, :install] 

desc "package sproutcore for Wise4 but don't copy"
task :build => [:repackage, :inject_javascript, :copy_templates, :copy_icons]

desc "copy the files to the Wise4 vle directory dir"
task :install do
  dest_dir = "#{@tomcat_dir}/webapps/vlewrapper/vle/node/#{@wise_step_name}" 
  src_dir = @output_directory
  %x[ rm -rf #{dest_dir}]
  %x[ cp -r #{src_dir} #{dest_dir}]
end

  
desc "clean the output directory"
task :clean do
    # remove the old build directory
    %x[rm -rf #{@output_directory}]
end

desc "add script loader callback to javascript files"
task :inject_javascript do
  javascript_files = Dir.glob(File.join(@output_directory,'js','*.js'))
  javascript_files.each do |file|
    File.open(file,'a') do |f|
      f.puts # lets add a newline
      javascript = "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', '#{file}');};"
      f.puts javascript
    end
  end
end

desc "build wise-4 files from standard sprout-core build"
task :repackage => [:clean] do
  begin
    require 'resource_squasher'
    # clean and build the release
    %x[sc-build #{@sc_project_name} -r -c --languages=en]

    # compact and rewrite application for wise4
    puts "rezsquish squash --project_name=#{@sc_project_name} --output_dir=#{@output_directory} --index_file=#{@wise_step_name}"
    %x[rezsquish squash --project_name=#{@sc_project_name} --output_dir=#{@output_directory} --index_file=#{@wise_step_name}]

    # rename the html file
    # Now we use the <stepname>.html.erb template for this
    #%x[mv #{@output_directory}/00*.html #{@output_directory}/#{@wise_step_name}.html]

  rescue LoadError
    puts "ensure that you are using bundler, and that resource_squasher gem is"
    puts "defined in your Gemfil. Then do 'bundle install'"
    puts "Invoke rake using 'bundle exec rake'"
  end
end


desc  "Copy vle wrapper classes using template files with variable substition"
task :copy_templates => [:copy_authoring] do
  templates = Dir.glob(File.join(@template_directory, "**", "*#{@template_suffix}"))
  js        = Dir.glob(File.join(@output_directory,"js","*.js"))

  js_files = []
  js_files += js.map do |j|
    filename = j.gsub("vle/#{@wise_step_name}/","vle/node/#{@wise_step_name}/")
    "'#{filename}'"
  end

  js_files = js_files.join(",\n\t")

  css       = Dir.glob(File.join(@output_directory,"css","*.css"))
  css_files = css.map do |j|
    filename = j.gsub("vle/#{@wise_step_name}/","vle/node/#{@wise_step_name}/")
    "'#{filename}'"
  end
  css_files = css_files.join(",\n\t")

  templates.each do |filename|
    template = ERB.new(::File.read(filename))
    template.filename = filename
    content = template.result(binding)
    resultname = File.basename(filename).gsub(/#{@template_suffix}$/,'')
    resultpath = File.join(@output_directory, resultname)
    File.open(resultpath,'w') do |f|
      f.write(content)
      puts "translated #{filename} to #{resultpath}"
    end
  end
end

desc "Copy authoring files"
task :copy_authoring do
  dest_dir = "#{@output_directory}/authoring"
  %x[ mkdir -p #{dest_dir} ]
  %x[ cp -r public/authoring/* #{dest_dir} ]
end

desc "Copy icons"
task :copy_icons do
  icons = File.join(@template_directory,'icons')
  %x[ mkdir -p #{@output_directory} ]
  %x[ cp -r #{icons} #{@output_directory} ]
end

namespace :demos do
  base_dir = File.join(File.dirname(__FILE__),'debug')
  desc "snapshot demo"
  task :snapshot_demo do
    dest_dir = File.join(base_dir,'snapshot_demo/app/')
    src_dir = @output_directory
    %x[ mkdir -p #{dest_dir}]
    %x[ cp -r #{src_dir} #{dest_dir}]
  end
end
