# used by developers to create a fake tempo.js and tempo.css file 
# which allows them to work with more than one source file, which is useful during the 
# development process

use strict;

my $jsfileName = "js\\tempo.js";
my @jsfiles = loadFileList('javascriptfiles.txt');

my $cssfileName = "css\\tempo.css";
my @cssfiles = loadFileList('cssfiles.txt');

#used to count the js
my $num = 1;


#delete the file
print "deleting $jsfileName ...\n";
unlink($jsfileName);

print "creating new version of $jsfileName...\n";
open (BUFF, '>', $jsfileName) or die "Unable to open $jsfileName";

	print BUFF jsHead();

	for my $file(@jsfiles){
		print BUFF jsInclude($file);	
	}

	print BUFF jsFoot();

close (BUFF);

print "deleting $cssfileName ...\n";
print "creating new verison of $cssfileName ...\n";
open (BUFF, '>', $cssfileName) or die "Unable to open $cssfileName";

	for my $file(@cssfiles){
		print BUFF cssInclude($file);	
	}


close (BUFF);

	print "updating templates.js from templates.xml ...\n";

	my $templateFileName = "js\\tempo.xml";
	my @templatefiles = loadFileList('templatefiles.txt');

	open (BUFF, '>', $templateFileName) or die "Unable to open $templateFileName";

	print BUFF "<templates>";

	for my $file(@templatefiles){
		# trim some of the build info 
		$file =~ s/\.\.\/src\///;
		open (TPLFILE, $file) or die "Unable to open $file for read";
		print "    Loading $file";
		while (<TPLFILE>) {
			print BUFF "$_";
		}
		
		close (TPLFILE);
	}

	print BUFF "</templates>";

	close (BUFF);
	
	print "\n";

	my $commandLine = "java -jar xml2json.jar $templateFileName js\\templates.js";
	
	system $commandLine;




sub jsHead
{
	my $head = <<"ENDOFHEAD";

	/* 
		DEVELOPER'S VERSION tempo.JS

		This file should NOT be checked in!
		It is intended for use on developer's machines during the 
		development process. It will load all of the required 
		css and javascript files, allowing a developer to work
		from multiple files without having to change index.jsp
		which is only looking for one js file and one css file.
	*/
	function loadScript(sScriptSrc,callbackfunction) 
	{
		//gets document head element
		var oHead = document.getElementsByTagName('head')[0];
		if(oHead)
		{
			//creates a new script tag		
			var oScript = document.createElement('script');
					
			//adds src and type attribute to script tag
			oScript.setAttribute('src',sScriptSrc);
			oScript.setAttribute('type','text/javascript');

			//calling a function after the js is loaded (IE)
			var loadFunction = function()
				{
					if (this.readyState == 'complete' || this.readyState == 'loaded')
					{
						callbackfunction(); 
					}
				};
			oScript.onreadystatechange = loadFunction;

			//calling a function after the js is loaded (Firefox)
			oScript.onload = callbackfunction;
			
			//append the script tag to document head element		
			oHead.appendChild(oScript);
		}
	};

	loadScript(info.repo+'/js/jquery.js',load1);

ENDOFHEAD

	return $head;
}

sub jsFoot
{

	return "function load$num(){var x = \$.address.value();\$.address.value('');\$.address.value(x); };";
}

sub jsInclude
{
	my $line = shift;
#trim newline
	chomp($line);

# trim some of the build info 
		$line =~ s/\.\.\/src\///;

# find the template.js file
		$line =~ s/.*\/obj\//js\//;

	if ($line =~ m/jquery.js$/){

# don't include jquery in this way as it was already loaded
		print "Skipping $line \n";
		$line = '';

	}else{
# add the js files
		$line = "function load".$num++."(){\$.getScript(info.repo+'/$line', load$num);}";
	}

	return "$line\n";
}


sub loadFileList 
{
	my $file = shift;
	my @files;

	print "loading list of files from $file ...\n";

	open (FH, "< $file") or die "Can't open $file for read: $!";
	while (<FH>) {
		push (@files, $_);
	}
	close FH or die "Cannot close $file: $!";
	return @files;
}

sub cssInclude
{
	my $line = shift;
#trim newline
	chomp($line);

# trim some of the build info 
		$line =~ s/\.\.\/src\/css\///;

		return "\@import url('$line');"
}
