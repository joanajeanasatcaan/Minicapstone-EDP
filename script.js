    $(document).ready(function () {
      // Toggle quotes
      $('#toggle-facts').on('click', function () {
        const isVisible = $('#facts-list').is(':visible');
        $('#facts-list').slideToggle(400);
        $(this).html(
          isVisible 
            ? '<i class="fas fa-eye"></i> Show Quotes' 
            : '<i class="fas fa-eye-slash"></i> Hide Quotes'
        );
      });

      // Fetch GitHub Profile using AJAX
      $('#fetch-github').on('click', function () {
        const username = $('#github-username').val().trim();
        const $button = $(this);
        const $githubData = $('#github-data');

        if (!username) {
          $githubData.html(`
            <div style="padding: 15px; background: #ffeeee; border-radius: 8px; color: #d90429; margin-top: 20px;">
              <i class="fas fa-exclamation-circle"></i> Please enter a GitHub username.
            </div>
          `).slideDown();
          return;
        }

        $button.html('<i class="fas fa-spinner fa-spin"></i> Searching...').prop('disabled', true);

        $.ajax({
          url: `https://api.github.com/users/${username}`,
          method: 'GET',
          success: function (data) {
            const profileHtml = `
              <div class="github-profile">
                <img src="${data.avatar_url}" alt="${data.login}">
                <div class="github-info">
                  <h3>${data.name || data.login}</h3>
                  <p>${data.bio || 'No bio available'}</p>
                  <div class="github-stats">
                    <div class="stat"><i class="fas fa-users"></i> ${data.followers} followers</div>
                    <div class="stat"><i class="fas fa-user-plus"></i> ${data.following} following</div>
                    <div class="stat"><i class="fas fa-code-branch"></i> ${data.public_repos} repos</div>
                  </div>
                  ${data.blog ? `<p style="margin-top: 10px;"><i class="fas fa-link"></i> <a href="${data.blog.startsWith('http') ? data.blog : 'https://' + data.blog}" target="_blank">${data.blog}</a></p>` : ''}
                </div>
              </div>
              <a href="${data.html_url}" target="_blank" class="btn btn-outline" style="display: inline-flex; align-items: center; gap: 8px; margin-top: 15px;">
                <i class="fab fa-github"></i> View Full Profile
              </a>
            `;
            $githubData.html(profileHtml).slideDown();
          },
          error: function () {
            $githubData.html(`
              <div style="padding: 15px; background: #ffeeee; border-radius: 8px; color: #d90429; margin-top: 20px;">
                <i class="fas fa-exclamation-circle"></i> User "${username}" not found. Please check the username and try again.
              </div>
            `).slideDown();
          },
          complete: function() {
            $button.html('<i class="fas fa-search"></i> Search').prop('disabled', false);
          }
        });
      });

      // jQuery UI: Accordion and Datepicker
      $('#accordion').accordion({
        heightStyle: "content",
        collapsible: true,
        active: false,
        icons: { "header": "fas fa-plus", "activeHeader": "fas fa-minus" }
      });
      
      $('#contact-date').datepicker({
        dateFormat: 'MM dd, yy',
        minDate: 0,
        beforeShowDay: function(date) {
          const day = date.getDay();
          return [(day > 0 && day < 6), ''];
        }
      });

      // Contact Form Validation and Success Message
      $('#form').on('submit', function (e) {
        e.preventDefault();
        const $form = $(this);
        const $successAlert = $('#form-success');

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const message = $('#message').val().trim();

        if (!name) {
          $('#name').addClass('error').focus();
          return;
        }

        if (!email.includes('@') || !email.includes('.')) {
          $('#email').addClass('error').focus();
          return;
        }

        if (message.length < 10) {
          $('#message').addClass('error').focus();
          return;
        }

        $('input, textarea').removeClass('error');

        $successAlert.html(`
          <i class="fas fa-check-circle"></i> Thanks for your message, ${name}! I'll get back to you soon.
        `).slideDown().delay(3000).slideUp();

        $form.trigger('reset');
      });

      // Highlight clicked quote
      $('#facts-list').on('click', 'li', function () {
        const $this = $(this);
        $('#facts-list li').not($this).removeClass('highlight');
        $this.toggleClass('highlight');
        
        // Add animation
        $this.css('transform', 'scale(1.02)');
        setTimeout(() => {
          $this.css('transform', 'scale(1)');
        }, 200);
      });

      // Animate skill bars on scroll into view
      $(window).on('scroll', function() {
        $('.skill-progress').each(function() {
          const $this = $(this);
          const skillTop = $this.offset().top;
          const windowHeight = $(window).height();
          const scrollTop = $(window).scrollTop();
          
          if (scrollTop > (skillTop - windowHeight + 200)) {
            $this.css('width', $this.attr('style').match(/width: (\d+)%/)[1] + '%');
          }
        });
      }).scroll();
    });
